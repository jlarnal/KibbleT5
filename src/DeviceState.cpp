#include "DeviceState.hpp"
#include "esp_log.h"
#include "ArduinoJson.h"
#include <SPIFFS.h>

static const char* TAG           = "DeviceSettings";
static const char* SETTINGS_FILE = "/settings.json";

// --- Private Methods for SPIFFS Interaction ---

/**
 * @brief Saves the current settings from the in-memory struct to the SPIFFS file.
 * This is a private helper function called by the public setters.
 */
static void _saveSettingsToFile(const DeviceState::Settings_t& settings)
{
    JsonDocument doc;
    doc["dispenseWeightChangeThreshold"]      = settings.getDispensingWeightChangeThreshold();
    doc["dispensingNoWeightChangeTimeout_ms"] = settings.getDispensingNoWeightChangeTimeout_ms();
    doc["scaleSamplesCount"]                  = settings.getScaleSamplesCount();

    File file = SPIFFS.open(SETTINGS_FILE, FILE_WRITE);
    if (!file) {
        ESP_LOGE(TAG, "Failed to open settings file for writing");
        return;
    }

    if (serializeJson(doc, file) == 0) {
        ESP_LOGE(TAG, "Failed to write to settings file");
    } else {
        ESP_LOGI(TAG, "Settings successfully saved to %s", SETTINGS_FILE);
    }
    file.close();
}

/**
 * @brief Loads settings from the SPIFFS file into the in-memory struct.
 * Called once at startup. If the file doesn't exist, it initializes with defaults.
 */
static bool _loadSettingsFromFile(DeviceState::Settings_t& settings)
{    
    if (!SPIFFS.exists(SETTINGS_FILE)) {
        ESP_LOGW(TAG, "Settings file not found. Initializing with defaults and creating file.");
        settings.resetToDefaults(); // This will also trigger the first save.
        return false;
    }

    File file = SPIFFS.open(SETTINGS_FILE, FILE_READ);
    if (!file) {
        ESP_LOGE(TAG, "Failed to open settings file for reading. Using defaults.");
        settings.resetToDefaults();
        return false;
    }

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, file);
    file.close();

    if (error) {
        ESP_LOGE(TAG, "Failed to parse settings file. Using defaults. Error: %s", error.c_str());
        settings.resetToDefaults();
        return false;
    }

    // Load values from JSON, using defaults as a fallback if a key is missing.
    settings.setDispensingWeightChangeThreshold(doc["dispenseWeightChangeThreshold"] | 3.0f);
    settings.setDispensingNoWeightChangeTimeout_ms(doc["dispensingNoWeightChangeTimeout_ms"] | 10000);
    settings.setScaleSamplesCount(doc["scaleSamplesCount"] | 5);

    ESP_LOGI(TAG, "Settings loaded successfully from %s", SETTINGS_FILE);
    return true;
}


// --- Public Method Implementations ---

// Constructor: Initializes settings to their default values and then tries to load from SPIFFS.
bool DeviceState::Settings_t::begin()
{
    resetToDefaults(false); // Initialize without saving
    return _loadSettingsFromFile(*this);
}

// Resets all settings to their default values and optionally saves to file.
void DeviceState::Settings_t::resetToDefaults(bool save)
{
    _dispensingWeightChangeThreshold    = 3.0f;
    _dispensingNoWeightChangeTimeout_ms = 10000;
    _scaleSamplesCount                  = 5;
    if (save) {
        _saveSettingsToFile(*this);
    }
    ESP_LOGI(TAG, "Settings reset to default values.");
}


// --- Getters ---

float DeviceState::Settings_t::getDispensingWeightChangeThreshold() const
{
    return _dispensingWeightChangeThreshold;
}

uint32_t DeviceState::Settings_t::getDispensingNoWeightChangeTimeout_ms() const
{
    return _dispensingNoWeightChangeTimeout_ms;
}

uint8_t DeviceState::Settings_t::getScaleSamplesCount() const
{
    return _scaleSamplesCount;
}

// --- Setters ---

void DeviceState::Settings_t::setDispensingWeightChangeThreshold(float newValue)
{
    if (_dispensingWeightChangeThreshold != newValue) {
        _dispensingWeightChangeThreshold = newValue;
        _saveSettingsToFile(*this);
    }
}

void DeviceState::Settings_t::setDispensingNoWeightChangeTimeout_ms(uint32_t value)
{
    if (_dispensingNoWeightChangeTimeout_ms != value) {
        _dispensingNoWeightChangeTimeout_ms = value;
        _saveSettingsToFile(*this);
    }
}

void DeviceState::Settings_t::setScaleSamplesCount(uint8_t value)
{
    if (_scaleSamplesCount != value) {
        _scaleSamplesCount = value > 0 ? value : 1; // Ensure at least 1 sample
        _saveSettingsToFile(*this);
    }
}

// Global definitions for the state object and its mutex handle.
// The mutex handle is initialized to NULL and created in main.cpp's setup().
DeviceState globalDeviceState;
SemaphoreHandle_t xDeviceStateMutex = NULL;
