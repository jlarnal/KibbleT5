#ifndef DEVICE_STATE_HPP
#define DEVICE_STATE_HPP

#include <Arduino.h>
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include <vector>
#include <string>
#include <time.h>
#include "TankManager.hpp" // For TankInfo struct definition
#include "ConfigManager.hpp" // For Recipe struct definition

/**
 * @file DeviceState.hpp
 * @brief Defines the central, thread-safe data structure for the device's state.
 */

// Enum for different feeding commands initiated by the user/API
enum class FeedCommandType {
    NONE,
    IMMEDIATE,
    RECIPE,
    EMERGENCY_STOP,
    TARE_SCALE
};

// Struct to hold feeding command details from the API
struct FeedCommand {
    FeedCommandType type = FeedCommandType::NONE;
    float amountGrams = 0.0;
    int recipeId = 0;
    // This flag is set to false by the WebServer and true by the feedingTask
    // to signal that a command has been acknowledged and is being processed.
    bool processed = true; 
};

// Struct for a single entry in the feeding history log
struct FeedingHistoryEntry {
    time_t timestamp;
    std::string description;
    float amount;
};

// The central volatile state structure for the entire application.
// All inter-task data sharing happens through this struct, protected by a mutex.
struct DeviceState {
    // System Status
    bool operational = true;
    std::string lastError = "";
    bool safetyModeEngaged = false;
    uint32_t uptime_s = 0;
    int8_t wifiStrength = 0;
    IPAddress ipAddress;
    std::string deviceName = "KibbleT5";
    std::string firmwareVersion = "1.1.0-stable";
    std::string buildDate = __DATE__;
    
    // Time
    time_t currentTime = 0;
    char formattedTime[20] = "TIME_NOT_SET"; // "YYYY-MM-DD HH:MM:SS"

    // Scale
    float currentWeight = 0.0;
    bool isWeightStable = false;

    // Tanks
    std::vector<TankInfo> connectedTanks;

    // Feeding
    FeedCommand feedCommand;
    std::string currentFeedingStatus = "Idle";
    std::vector<FeedingHistoryEntry> feedingHistory;

    // Servo Power
    bool servoPower = false;
};

// Global declarations for the state and its mutex.
// The actual definitions are in DeviceState.cpp.
extern DeviceState globalDeviceState;
extern SemaphoreHandle_t xDeviceStateMutex;

#endif // DEVICE_STATE_HPP
