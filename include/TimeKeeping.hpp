#ifndef TIMEKEEPING_HPP
#define TIMEKEEPING_HPP

#include "DeviceState.hpp"
#include "ConfigManager.hpp"
#include <time.h>

/**
 * @file TimeKeeping.hpp
 * @brief Manages NTP time synchronization and updates the global device state.
 */

class TimeKeeping {
public:
    TimeKeeping(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager);
    void begin();
    void startTask();

private:
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ConfigManager& _configManager;
    
    static void _timekeepingTask(void *pvParameters);
};

#endif // TIMEKEEPING_HPP
