#ifndef TANKMANAGER_HPP
#define TANKMANAGER_HPP

#include <OneWire.h>
#include <string>
#include <vector>
#include "OneWireEEPROM.hpp"
#include "ServoController.hpp"
#include "freertos/semphr.h" // Include the official FreeRTOS semaphore header

// Forward-declare DeviceState to break circular dependency.
// The full definition of DeviceState is only needed in the .cpp file.
struct DeviceState;

/**
 * @struct TankInfo
 * @brief Holds all the runtime and configuration data for a single connected tank.
 */
struct TankInfo {
    std::string uid;          // Read-only UID from the EEPROM
    std::string name;         // User-configurable name (e.g., "Chicken Kibble")
    float kibbleDensity;      // g/cm³ for volume-to-weight calculations
    int level;                // Estimated food level percentage (0-100)
    uint8_t servoId;          // The ID of the servo this tank controls
    bool connected;           // True if the tank is currently detected on the bus
};

class TankManager {
public:
    TankManager(DeviceState& deviceState, SemaphoreHandle_t& mutex, 
                OneWire* oneWire, OneWireEEPROM* eepromController, 
                ServoController* servoController);
    
    void begin();
    void startTask();
    uint8_t getServoIdForTank(const std::string& tankUid);
    bool setTankName(const std::string& uid, const std::string& newName);

private:
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    OneWire* _oneWire;
    OneWireEEPROM* _eepromController;
    ServoController* _servoController;
    std::vector<TankInfo> _knownTanks; // Internal list of tanks

    static void _tankDiscoveryTask(void* pvParameters);
    void _discoverAndSyncTanks();
};

#endif // TANKMANAGER_HPP
