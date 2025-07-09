#include "DeviceState.hpp"

/**
 * @file DeviceState.cpp
 * @brief Instantiates the global device state and its mutex.
 */

// Global definitions for the state object and its mutex handle.
// The mutex handle is initialized to NULL and created in main.cpp's setup().
DeviceState globalDeviceState;
SemaphoreHandle_t xDeviceStateMutex = NULL;
