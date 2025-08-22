#ifndef TANKMANAGER_HPP
#define TANKMANAGER_HPP

#include <string>
#include <vector>
#include "OneWireEEPROM.hpp"
#include "ServoController.hpp"
#include "freertos/semphr.h"
#include "board_pinout.h"

// Use extern "C" to link the C library in a C++ project
extern "C" {
    #include "1wire.h"
}

// Forward-declare DeviceState to break circular dependency.
struct DeviceState;

/**
 * @struct TankInfo
 * @brief Holds all the runtime and configuration data for a single connected tank,
 * aligned with the API schema and using standard data types.
 */
struct TankInfo {
    std::string uid;          // Read-only UID from the EEPROM
    std::string name;         // User-configurable name
    uint8_t ordinal;          // The bus index (0-5), used as the primary identifier.
    bool connected;           // True if the tank is currently detected on the bus
    
    // Values converted from fixed-point for external use
    double capacityLiters;    // Volumetric capacity in Liters
    double kibbleDensity;     // Kibble density in kg/L
    
    // Calculated values based on EEPROM data, matching the API schema
    double w_capacity_kg;     // Calculated weight capacity in kilograms
    double remaining_weight_kg; // Estimated remaining weight in kilograms

    // Servo calibration data
    uint16_t servoIdlePwm;
};

class TankManager {
public:
    // Constructor now takes ServoController directly.
    TankManager(DeviceState& deviceState, SemaphoreHandle_t& mutex, 
                ServoController* servoController);
    
    void begin();
    void startTask();

    // Public methods for tank management and information retrieval.
    bool setTankName(uint8_t ordinal, const std::string& newName);
    // This function will handle updating various properties of the tank, not just the name.
    bool updateTankConfig(const std::string& tankUid, const std::string& newName, double new_w_capacity_kg);
    uint8_t getOrdinalForTank(const std::string& tankUid);

    // Public method for the hardware test suite
    void testBus(uint8_t busIndex);

private:
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ServoController* _servoController;
    
    // A handle to the C 1-Wire driver instance.
    OneWireConfig_t owCfg;
    OneWireEEPROM* _eepromController;

    // A dedicated mutex to protect 1-Wire bus transactions.
    SemaphoreHandle_t _oneWireMutex;

    // Internal list of tanks, which holds the comprehensive state.
    std::vector<TankInfo> _knownTanks; 

    // Helper functions for fixed-point conversion
    double q3_13_to_double(uint16_t q_val);
    uint16_t double_to_q3_13(double d_val);
    double q2_14_to_double(uint16_t q_val);
    uint16_t double_to_q2_14(double d_val);

    // Private helpers to manage the multiplexer hardware
    void _selectBus(uint8_t busIndex);
    void _powerBus(bool powerOn);

    static void _tankDiscoveryTask(void* pvParameters);
    void _discoverAndSyncTanks();
};

#endif // TANKMANAGER_HPP
