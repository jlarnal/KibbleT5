#include "HX711Scale.hpp"
#include "esp_log.h"

static const char* TAG = "HX711Scale";

HX711Scale::HX711Scale(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager)
    : _deviceState(deviceState), 
      _mutex(mutex), 
      _configManager(configManager), 
      _scaleMutex(NULL),
      _calibrationFactor(400.0f), 
      _zeroOffset(0) 
{}

bool HX711Scale::begin(uint8_t dataPin, uint8_t clockPin) {
    _scaleMutex = xSemaphoreCreateMutex();
    if (_scaleMutex == NULL) {
        ESP_LOGE(TAG, "Fatal: Could not create scale mutex.");
        return false;
    }

    _scale.begin(dataPin, clockPin);
    _configManager.loadScaleCalibration(_calibrationFactor, _zeroOffset);
    _scale.set_scale(_calibrationFactor);
    _scale.set_offset(_zeroOffset);
    ESP_LOGI(TAG, "Scale initialized with factor: %.2f, offset: %ld", _calibrationFactor, _zeroOffset);
    return true;
}

void HX711Scale::tare() {
    // Tare takes a fixed number of samples (20), so we can calculate a generous timeout.
    TickType_t timeout = pdMS_TO_TICKS(20 * FAST_MODE_SAMPLING_PERIOD_MS + 100);

    if (xSemaphoreTake(_scaleMutex, timeout) == pdTRUE) {
        ESP_LOGI(TAG, "Taring scale...");
        _scale.tare(20); 
        _zeroOffset = _scale.get_offset();
        xSemaphoreGive(_scaleMutex);
        ESP_LOGI(TAG, "Tare complete. New offset: %ld", _zeroOffset);
        saveCalibration();
    } else {
        ESP_LOGE(TAG, "Failed to acquire scale mutex for tare().");
    }
}

float HX711Scale::getWeight() {
    float weight = 0.0f;
    uint8_t samples = _deviceState.Settings.getScaleSamplesCount() > 0 ? _deviceState.Settings.getScaleSamplesCount() : 1;
    TickType_t timeout = pdMS_TO_TICKS(samples * FAST_MODE_SAMPLING_PERIOD_MS + 50);

    if (xSemaphoreTake(_scaleMutex, timeout) == pdTRUE) {
        weight = _scale.get_units(samples);
        xSemaphoreGive(_scaleMutex);
    } else {
        ESP_LOGE(TAG, "Failed to acquire scale mutex for getWeight().");
    }
    return weight;
}

long HX711Scale::getRawReading() {
    long rawValue = 0;
    uint8_t samples = _deviceState.Settings.getScaleSamplesCount() > 0 ? _deviceState.Settings.getScaleSamplesCount() : 1;
    TickType_t timeout = pdMS_TO_TICKS(samples * FAST_MODE_SAMPLING_PERIOD_MS + 50);

    if (xSemaphoreTake(_scaleMutex, timeout) == pdTRUE) {
        rawValue = _scale.read_average(samples);
        xSemaphoreGive(_scaleMutex);
    } else {
        ESP_LOGE(TAG, "Failed to acquire scale mutex for getRawReading().");
    }
    return rawValue;
}

float HX711Scale::calibrateWithKnownWeight(float knownWeight) {
    if (knownWeight <= 0) {
        ESP_LOGE(TAG, "Calibration failed: Known weight must be positive.");
        return _calibrationFactor;
    }
    // getRawReading() is already thread-safe.
    long reading = getRawReading(); 
    
    // setCalibrationFactor() is also thread-safe.
    float new_factor = (float)(reading - _zeroOffset) / knownWeight;
    setCalibrationFactor(new_factor);
    
    saveCalibration();
    ESP_LOGI(TAG, "Scale calibrated with new factor: %.4f", new_factor);
    return new_factor;
}

void HX711Scale::setCalibrationFactor(float factor) {
    // This requires a very short lock as it's a quick operation.
    if (xSemaphoreTake(_scaleMutex, pdMS_TO_TICKS(50)) == pdTRUE) {
        _calibrationFactor = factor;
        _scale.set_scale(factor);
        xSemaphoreGive(_scaleMutex);
        ESP_LOGI(TAG, "Calibration factor set to: %.2f", factor);
    } else {
        ESP_LOGE(TAG, "Failed to acquire scale mutex for setCalibrationFactor().");
    }
}

float HX711Scale::getCalibrationFactor() {
    return _calibrationFactor;
}

long HX711Scale::getZeroOffset() {
    return _zeroOffset;
}

void HX711Scale::saveCalibration() {
    _configManager.saveScaleCalibration(_calibrationFactor, _zeroOffset);
    ESP_LOGI(TAG, "Scale calibration saved to NVS.");
}

void HX711Scale::startTask() {
    xTaskCreate(
        _scaleTask,
        "Scale Task",
        4096,
        this,
        5,
        NULL
    );
}

void HX711Scale::_scaleTask(void *pvParameters) {
    HX711Scale* instance = (HX711Scale*)pvParameters;
    ESP_LOGI(TAG, "Scale Task Started.");
    
    TickType_t lastWakeTime = xTaskGetTickCount();
    const TickType_t frequency = pdMS_TO_TICKS(250); // 4Hz

    for (;;) {
        // These calls are now thread-safe due to the internal mutex.
        float current_weight = instance->getWeight();
        long raw_value = instance->getRawReading();
        
        // This mutex protects the global device state, which is a different resource.
        if (xSemaphoreTake(instance->_mutex, portMAX_DELAY) == pdTRUE) {
            instance->_deviceState.isWeightStable = (abs(current_weight - instance->_deviceState.currentWeight) < 0.5);
            instance->_deviceState.currentWeight = current_weight;
            instance->_deviceState.currentRawValue = raw_value;
            xSemaphoreGive(instance->_mutex);
        }
        
        vTaskDelayUntil(&lastWakeTime, frequency);
    }
}
