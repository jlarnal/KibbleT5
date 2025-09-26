#ifndef SAFETYSYSTEM_HPP
#define SAFETYSYSTEM_HPP

#include "DeviceState.hpp"
#include "TankManager.hpp"

/**
 * @file SafetySystem.hpp
 * @brief Monitors system state for unsafe conditions and takes action.
 */

class SafetySystem {
public:
    SafetySystem(DeviceState& deviceState, SemaphoreHandle_t& mutex, TankManager& tankManager);
    void startTask();

private:
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    TankManager& _tankManager;

    static void _safetyTask(void *pvParameters);
};

#endif // SAFETYSYSTEM_HPP
