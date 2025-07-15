#include "RecipeProcessor.hpp"
#include "esp_log.h"
#include <algorithm>

static const char* TAG = "RecipeProcessor";

RecipeProcessor::RecipeProcessor(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager, 
                                 TankManager& tankManager, ServoController& servoController, HX711Scale& scale)
    : _deviceState(deviceState), _mutex(mutex), _configManager(configManager), 
      _tankManager(tankManager), _servoController(servoController), _scale(scale) {}

void RecipeProcessor::begin() {
    _loadRecipesFromNVS();
    ESP_LOGI(TAG, "Loaded %d recipes from NVS.", _recipes.size());
}

HX711Scale& RecipeProcessor::getScale() {
    return _scale;
}

bool RecipeProcessor::executeImmediateFeed(const std::string& tankUid, float targetWeight) {
    if (tankUid.empty()) {
        ESP_LOGE(TAG, "Immediate feed failed: No tank UID provided.");
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "No tank specified for feed.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    ESP_LOGI(TAG, "Starting immediate feed of %.2fg from tank %s", targetWeight, tankUid.c_str());
    bool success = _dispenseIngredient(tankUid, targetWeight);

    // Log the immediate feeding event
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        FeedingHistoryEntry entry = {time(nullptr), "immediate", -1, success, targetWeight, "Immediate Feed"};
        _deviceState.feedingHistory.push_back(entry);
        xSemaphoreGive(_mutex);
    }
    
    return success;
}

bool RecipeProcessor::executeRecipeFeed(int recipeId) {
    Recipe recipe = getRecipeById(recipeId);
    if (recipe.id == -1) {
        ESP_LOGE(TAG, "Recipe feed failed: Recipe with ID %d not found.", recipeId);
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "Recipe not found.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    ESP_LOGI(TAG, "Executing recipe '%s'", recipe.name.c_str());
    _scale.tare(); 
    float totalDispensed = 0;
    bool overallSuccess = true;

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

        ESP_LOGI(TAG, "Dispensing %.2fg from tank %s", ingredient.amountGrams, ingredient.tankUid.c_str());
        if (!_dispenseIngredient(ingredient.tankUid, ingredient.amountGrams)) {
            ESP_LOGE(TAG, "Failed to dispense ingredient from tank %s. Aborting recipe.", ingredient.tankUid.c_str());
            stopAllFeeding();
            overallSuccess = false;
            break;
        }
        totalDispensed += ingredient.amountGrams; // This is an approximation
        vTaskDelay(pdMS_TO_TICKS(1000));
    }

    if (overallSuccess) {
        ESP_LOGI(TAG, "Recipe '%s' completed successfully.", recipe.name.c_str());
    }
    
    // Log the feeding event, whether it succeeded or failed
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        FeedingHistoryEntry entry = {time(nullptr), "recipe", recipe.id, overallSuccess, totalDispensed, recipe.name};
        _deviceState.feedingHistory.push_back(entry);
        xSemaphoreGive(_mutex);
    }
    return overallSuccess;
}

bool RecipeProcessor::_dispenseIngredient(const std::string& tankUid, float targetWeight) {
    uint8_t servoId = _tankManager.getOrdinalForTank(tankUid);
    if (servoId == 255) {
        ESP_LOGE(TAG, "Dispense failed: No servo found for tank UID %s", tankUid.c_str());
        if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
            _deviceState.lastError = "Servo not found for tank.";
            xSemaphoreGive(_mutex);
        }
        return false;
    }

    float initialWeight = _scale.getWeight();
    float dispensedWeight = 0;
    
    _servoController.setServoPower(true);
    vTaskDelay(pdMS_TO_TICKS(100)); 
    _servoController.setContinuousServo(servoId, 1.0f); 

    const TickType_t timeout = pdMS_TO_TICKS(30000); 
    TickType_t startTime = xTaskGetTickCount();

    while (dispensedWeight < targetWeight) {
        dispensedWeight = _scale.getWeight() - initialWeight;

        if (xTaskGetTickCount() - startTime > timeout) {
            ESP_LOGE(TAG, "Dispense timed out for tank %s.", tankUid.c_str());
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
            _servoController.setContinuousServo(servoId, 0.2f); 
        }

        vTaskDelay(pdMS_TO_TICKS(50));
    }

    _servoController.setContinuousServo(servoId, 0.0f); 
    vTaskDelay(pdMS_TO_TICKS(500)); 
    _servoController.setServoPower(false);

    ESP_LOGI(TAG, "Dispensed %.2fg (target %.2fg) from tank %s", dispensedWeight, targetWeight, tankUid.c_str());
    return true;
}

void RecipeProcessor::stopAllFeeding() {
    ESP_LOGW(TAG, "Stopping all servos.");
    _servoController.stopAllServos();
    _servoController.setServoPower(false);
}

void RecipeProcessor::_loadRecipesFromNVS() {
    _recipes = _configManager.loadRecipes();
}

void RecipeProcessor::_saveRecipesToNVS() {
    _configManager.saveRecipes(_recipes);
}

bool RecipeProcessor::addRecipe(const Recipe& recipe) {
    int maxId = 0;
    for(const auto& r : _recipes) {
        if (r.id > maxId) maxId = r.id;
    }
    Recipe newRecipe = recipe;
    newRecipe.id = maxId + 1;
    _recipes.push_back(newRecipe);
    _saveRecipesToNVS();
    return true;
}

bool RecipeProcessor::updateRecipe(const Recipe& recipe) {
    for (auto& r : _recipes) {
        if (r.id == recipe.id) {
            r = recipe;
            _saveRecipesToNVS();
            return true;
        }
    }
    return false;
}

bool RecipeProcessor::deleteRecipe(int recipeId) {
    auto it = std::remove_if(_recipes.begin(), _recipes.end(), 
        [recipeId](const Recipe& r){ return r.id == recipeId; });

    if (it != _recipes.end()) {
        _recipes.erase(it, _recipes.end());
        _saveRecipesToNVS();
        return true;
    }
    return false;
}

std::vector<Recipe> RecipeProcessor::getRecipes() {
    return _recipes;
}

Recipe RecipeProcessor::getRecipeById(int recipeId) {
    for (const auto& r : _recipes) {
        if (r.id == recipeId) {
            return r;
        }
    }
    return {-1, "Not Found", {}};
}
