#ifndef RECIPEPROCESSOR_HPP
#define RECIPEPROCESSOR_HPP

#include "DeviceState.hpp"
#include "ConfigManager.hpp"
#include "TankManager.hpp"
#include "ServoController.hpp"
#include "HX711Scale.hpp"

/**
 * @file RecipeProcessor.hpp
 * @brief Handles the logic for dispensing kibble for recipes or immediate feeds.
 */

class RecipeProcessor {
public:
    RecipeProcessor(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager, 
                    TankManager& tankManager, ServoController& servoController, HX711Scale& scale);
    
    void begin();

    // These methods are called by the central feeding task
    bool executeImmediateFeed(float targetWeight);
    bool executeRecipeFeed(int recipeId);
    void stopAllFeeding();

    // Recipe management methods (called by WebServer)
    bool addRecipe(const Recipe& recipe);
    bool updateRecipe(const Recipe& recipe);
    bool deleteRecipe(int recipeId);
    std::vector<Recipe> getRecipes();
    Recipe getRecipeById(int recipeId);

    // Provide access to the scale for taring
    HX711Scale& getScale();

private:
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ConfigManager& _configManager;
    TankManager& _tankManager;
    ServoController& _servoController;
    HX711Scale& _scale;

    std::vector<Recipe> _recipes;

    void _loadRecipesFromNVS();
    void _saveRecipesToNVS();
    bool _dispenseIngredient(const std::string& tankUid, float targetWeight);
};

#endif // RECIPEPROCESSOR_HPP
