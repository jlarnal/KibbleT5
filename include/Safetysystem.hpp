#ifndef SAFETYSYSTEM_HPP
#define SAFETYSYSTEM_HPP

#include "DeviceState.hpp"
#include "ServoController.hpp"

/**
 * @file SafetySystem.hpp
 * @brief Monitors system state for unsafe conditions and takes action.
 */

class SafetySystem {
public:
    SafetySystem(DeviceState& deviceState, SemaphoreHandle_t& mutex, ServoController& servoController);
    void startTask();

private:
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ServoController& _servoController;

    static void _safetyTask(void *pvParameters);
};

#endif // SAFETYSYSTEM_HPP
