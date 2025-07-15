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
    std::string tankUid = ""; 
    float amountGrams = 0.0;
    int recipeId = 0;
    bool processed = true; 
};

// Expanded to match the API schema for feeding history
struct FeedingHistoryEntry {
    time_t timestamp;
    std::string type; // "recipe" or "immediate"
    int recipeId; 
    bool success;
    float amount;
    std::string description; // e.g., Recipe Name or "Immediate Feed"

    // Constructor to allow for direct initialization, fixing the compilation error.
    FeedingHistoryEntry(time_t ts, const std::string& t, int rId, bool s, float a, const std::string& d)
        : timestamp(ts), type(t), recipeId(rId), success(s), amount(a), description(d) {}
};

// The central volatile state structure for the entire application.
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
    char formattedTime[20] = "TIME_NOT_SET";

    // Scale
    float currentWeight = 0.0;
    long currentRawValue = 0;
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

extern DeviceState globalDeviceState;
extern SemaphoreHandle_t xDeviceStateMutex;

#endif // DEVICE_STATE_HPP
