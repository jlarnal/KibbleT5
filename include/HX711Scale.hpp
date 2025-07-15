#ifndef HX711SCALE_HPP
#define HX711SCALE_HPP

#include <HX711.h>
#include "DeviceState.hpp"
#include "ConfigManager.hpp"

/**
 * @file HX711Scale.hpp
 * @brief Manages the load cell and HX711 amplifier.
 */

class HX711Scale {
public:
    HX711Scale(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager);
    bool begin(uint8_t dataPin, uint8_t clockPin);
    void tare();
    float getWeight();
    long getRawReading();
    void startTask();
    
    // New method for calibration based on the API schema
    float calibrateWithKnownWeight(float knownWeight);

    void setCalibrationFactor(float factor);
    float getCalibrationFactor();
    long getZeroOffset();
    void saveCalibration();

private:
    HX711 _scale;
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ConfigManager& _configManager;

    float _calibrationFactor;
    long _zeroOffset;

    static void _scaleTask(void *pvParameters);
};

#endif // HX711SCALE_HPP
