#include "HX711Scale.hpp"
#include "esp_log.h"

static const char* TAG = "HX711Scale";

HX711Scale::HX711Scale(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager)
    : _deviceState(deviceState), _mutex(mutex), _configManager(configManager), _calibrationFactor(400.0f), _zeroOffset(0) {}

bool HX711Scale::begin(uint8_t dataPin, uint8_t clockPin) {
    _scale.begin(dataPin, clockPin);
    _configManager.loadScaleCalibration(_calibrationFactor, _zeroOffset);
    _scale.set_scale(_calibrationFactor);
    _scale.set_offset(_zeroOffset);
    ESP_LOGI(TAG, "Scale initialized with factor: %.2f, offset: %ld", _calibrationFactor, _zeroOffset);
    return true;
}

void HX711Scale::tare() {
    ESP_LOGI(TAG, "Taring scale...");
    _scale.tare(20); // Average 20 readings
    _zeroOffset = _scale.get_offset();
    ESP_LOGI(TAG, "Tare complete. New offset: %ld", _zeroOffset);
    saveCalibration();
}

float HX711Scale::getWeight() {
    return _scale.get_units(5); // Average 5 readings
}

void HX711Scale::setCalibrationFactor(float factor) {
    _calibrationFactor = factor;
    _scale.set_scale(factor);
    ESP_LOGI(TAG, "Calibration factor set to: %.2f", factor);
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
        float current_weight = instance->getWeight();
        
        if (xSemaphoreTake(instance->_mutex, portMAX_DELAY) == pdTRUE) {
            // Check for stability (e.g., within 0.5g of the last reading)
            instance->_deviceState.isWeightStable = (abs(current_weight - instance->_deviceState.currentWeight) < 0.5);
            instance->_deviceState.currentWeight = current_weight;
            xSemaphoreGive(instance->_mutex);
        }
        
        vTaskDelayUntil(&lastWakeTime, frequency);
    }
}
