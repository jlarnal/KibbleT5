#include "RecipeProcessor.hpp"
#include "esp_log.h"
#include <algorithm>

static const char* TAG = "RecipeProcessor";

RecipeProcessor::RecipeProcessor(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager, TankManager& tankManager,
  HX711Scale& scale)
    : _deviceState(deviceState),
      _mutex(mutex),
      _configManager(configManager),
      _tankManager(tankManager),
      _scale(scale)
{}

void RecipeProcessor::begin()
{
    _loadRecipesFromNVS();
    ESP_LOGI(TAG, "Loaded %d recipes from NVS.", _recipes.size());
}

HX711Scale& RecipeProcessor::getScale()
{
    return _scale;
}

bool RecipeProcessor::executeImmediateFeed(const uint64_t tankUid, float targetWeight)
{
    if (tankUid == 0) {
        ESP_LOGE(TAG, "Immediate feed failed: No tank UID provided.");
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "No tank specified for feed.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    ESP_LOGI(TAG, "Starting immediate feed of %.2fg from tank 0x%016llx", targetWeight, tankUid);
    bool success = _dispenseIngredient(tankUid, targetWeight);

    // Log the immediate feeding event
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        FeedingHistoryEntry entry(time(nullptr), "immediate", -1, success, targetWeight, "Immediate Feed");
        _deviceState.feedingHistory.push_back(entry);
        xSemaphoreGive(_mutex);
    }

    return success;
}

bool RecipeProcessor::executeRecipeFeed(int recipeId, int servings)
{
    auto it = std::find_if(_recipes.begin(), _recipes.end(), [recipeId](const Recipe& r) { return r.id == recipeId; });

    if (it == _recipes.end()) {
        ESP_LOGE(TAG, "Recipe feed failed: Recipe with ID %d not found.", recipeId);
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "Recipe not found.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    Recipe& recipe = *it; // Get a reference to modify lastUsed

    if (recipe.servings <= 0) {
        ESP_LOGE(TAG, "Recipe '%s' has %d servings, cannot calculate portion size. Aborting.", recipe.name.c_str(), recipe.servings);
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "Invalid recipe: servings is zero.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    float singleServingWeight = recipe.dailyWeight / recipe.servings;
    ESP_LOGI(TAG, "Executing recipe '%s' for %d serving(s). Single serving weight: %.2fg", recipe.name.c_str(), servings, singleServingWeight);

    _scale.tare();
    float totalDispensed = 0;
    bool overallSuccess  = true;

    for (const auto& ingredient : recipe.ingredients) {
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            if (_deviceState.feedCommand.type == FeedCommandType::EMERGENCY_STOP) {
                ESP_LOGW(TAG, "Emergency stop commanded during recipe execution.");
                _deviceState.lastError = "Feeding stopped by user.";
                xSemaphoreGive(_mutex);
                stopAllFeeding();
                overallSuccess = false;
                break;
            }
            xSemaphoreGive(_mutex);
        }

        // Calculate the amount to dispense for this ingredient based on its percentage
        float amountToDispense = singleServingWeight * (ingredient.percentage / 100.0f) * servings;

        ESP_LOGI(TAG, "Dispensing %.2fg from tank 0x%016llx", amountToDispense, ingredient.tankUid);
        if (!_dispenseIngredient(ingredient.tankUid, amountToDispense)) {
            ESP_LOGE(TAG, "Failed to dispense ingredient from tank 0x%016llx. Aborting recipe.", ingredient.tankUid);
            stopAllFeeding();
            overallSuccess = false;
            break;
        }
        totalDispensed += amountToDispense; // This is an approximation
        vTaskDelay(pdMS_TO_TICKS(1000));
    }

    if (overallSuccess) {
        ESP_LOGI(TAG, "Recipe '%s' completed successfully.", recipe.name.c_str());
        // Update lastUsed timestamp and save
        recipe.lastUsed = time(nullptr);
        _saveRecipesToNVS();
    }

    // Log the feeding event, whether it succeeded or failed
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        FeedingHistoryEntry entry(time(nullptr), "recipe", recipe.id, overallSuccess, totalDispensed, recipe.name);
        _deviceState.feedingHistory.push_back(entry);
        xSemaphoreGive(_mutex);
    }
    return overallSuccess;
}

bool RecipeProcessor::_dispenseIngredient(const uint64_t tankUid, float targetWeight)
{
    int8_t servoId = _tankManager.getBusOfTank(tankUid); // servoId and tank ordinal (bus index) are the same thing.
    if (servoId < 0) {
        ESP_LOGE(TAG, "Dispense failed: tank #0x%016llx not found or TankManager is in servo mode.", tankUid);
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "Tank not found.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    float initialWeight   = _scale.getWeight();
    float dispensedWeight = 0;

    _tankManager.setServoPower(true);
    vTaskDelay(pdMS_TO_TICKS(200)); // Wait for servo power supply to stabilize
    _tankManager.setContinuousServo(servoId, 1.0f);

    const TickType_t timeout = pdMS_TO_TICKS(30000);
    TickType_t startTime     = xTaskGetTickCount();

    while (dispensedWeight < targetWeight) {
        dispensedWeight = _scale.getWeight() - initialWeight;

        if (xTaskGetTickCount() - startTime > timeout) {
            ESP_LOGE(TAG, "Dispense timed out for tank 0x%016llx.", tankUid);
            if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
                _deviceState.lastError = "Dispense operation timed out.";
                xSemaphoreGive(_mutex);
            }
            stopAllFeeding();
            return false;
        }

        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            if (_deviceState.feedCommand.type == FeedCommandType::EMERGENCY_STOP) {
                ESP_LOGW(TAG, "Emergency stop commanded during dispense.");
                _deviceState.lastError = "Feeding stopped by user.";
                xSemaphoreGive(_mutex);
                stopAllFeeding();
                return false;
            }
            xSemaphoreGive(_mutex);
        }

        if (targetWeight - dispensedWeight < 5.0) {
            _tankManager.setContinuousServo(servoId, 0.2f);
        }

        vTaskDelay(pdMS_TO_TICKS(50));
    }

    _tankManager.setContinuousServo(servoId, 0.0f);
    vTaskDelay(pdMS_TO_TICKS(500));
    _tankManager.setServoPower(false);

    ESP_LOGI(TAG, "Dispensed %.2fg (target %.2fg) from tank 0x%016llx", dispensedWeight, targetWeight, tankUid);
    return true;
}

void RecipeProcessor::stopAllFeeding()
{
    ESP_LOGW(TAG, "Stopping all servos.");
    _tankManager.stopAllServos();
}

void RecipeProcessor::_loadRecipesFromNVS()
{
    _recipes = _configManager.loadRecipes();
}

void RecipeProcessor::_saveRecipesToNVS()
{
    _configManager.saveRecipes(_recipes);
}

bool RecipeProcessor::addRecipe(const Recipe& recipe)
{
    int maxId = 0;
    for (const auto& r : _recipes) {
        if (r.id > maxId)
            maxId = r.id;
    }
    Recipe newRecipe   = recipe;
    newRecipe.id       = maxId + 1;
    newRecipe.created  = time(nullptr); // Set creation timestamp
    newRecipe.lastUsed = 0; // Initialize lastUsed to 0
    _recipes.push_back(newRecipe);
    _saveRecipesToNVS();
    ESP_LOGI(TAG, "Added new recipe '%s' with ID %d", newRecipe.name.c_str(), newRecipe.id);
    return true;
}

bool RecipeProcessor::updateRecipe(const Recipe& recipe)
{
    for (auto& r : _recipes) {
        if (r.id == recipe.id) {
            r.name        = recipe.name;
            r.ingredients = recipe.ingredients;
            r.dailyWeight = recipe.dailyWeight;
            r.servings    = recipe.servings;
            r.lastUsed    = time(nullptr); // Update last used timestamp on modification
            _saveRecipesToNVS();
            ESP_LOGI(TAG, "Updated recipe '%s' (ID %d)", r.name.c_str(), r.id);
            return true;
        }
    }
    ESP_LOGW(TAG, "Could not find recipe with ID %d to update.", recipe.id);
    return false;
}

bool RecipeProcessor::deleteRecipe(int recipeId)
{
    auto it = std::remove_if(_recipes.begin(), _recipes.end(), [recipeId](const Recipe& r) { return r.id == recipeId; });

    if (it != _recipes.end()) {
        _recipes.erase(it, _recipes.end());
        _saveRecipesToNVS();
        ESP_LOGI(TAG, "Deleted recipe with ID %d", recipeId);
        return true;
    }
    ESP_LOGW(TAG, "Could not find recipe with ID %d to delete.", recipeId);
    return false;
}

std::vector<Recipe> RecipeProcessor::getRecipes()
{
    return _recipes;
}

Recipe RecipeProcessor::getRecipeById(int recipeId)
{
    for (const auto& r : _recipes) {
        if (r.id == recipeId) {
            return r;
        }
    }
    return { -1, "Not Found", {}, 0, 0, 0, 0 }; // Return a valid but 'not found' recipe
}
