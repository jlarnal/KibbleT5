#ifndef TANKMANAGER_HPP
#define TANKMANAGER_HPP

#include <string>
#include <vector>
#include "ServoController.hpp"
#include "freertos/semphr.h"
#include "board_pinout.h"
#include <SwiMuxSerial.h>

// Forward-declare DeviceState to break circular dependency.
struct DeviceState;


class TankManager;

/** @brief Data structure for the tank's EEPROM, and UID. */
struct __attribute__((packed)) TankEEpromData_t {
    struct __attribute__((packed)) {
        uint8_t lastBaseMAC48[6]; // Last MAC48 of the KibbleT5 base this device was connected to.
        uint8_t lastBusIndex; // Last bus index this device was connected to.
    } history;
    uint8_t nameLength; // The length of the string stored in the `name` field.
    uint16_t capacity; // Capacity, in liters, as an unsigned Q3.13 number.
    uint16_t density; // A Q2.14 unsigned fixed number for kibble density in kg/L.
    uint16_t servoIdlePwm; // The PWM value (in microseconds) for the servo's idle position.
    uint16_t remainingGrams; // Remaining kibble in grams, with redundancy.
    char name[112]; // The name of the tank. In UTF-8 hopefully ?
};

/**
 * @struct TankInfo
 * @brief Holds all the runtime and configuration data for a single connected tank,
 * aligned with the API schema and using standard data types.
 */
struct TankInfo {

    uint64_t uid; // Read-only UID from the EEPROM
    uint8_t lastBaseMAC48[6]; // Last MAC48 of the KibbleT5 base this device was connected to.
    std::string name; // User-configurable name.
    int8_t busIndex; // The bus index (0-5) this tank has been detected at. Equal to -1 if not present on any bus.
    bool isFullInfo; // If <false>, the whole structure is simply a presence witness and onlyh the `.uid` and `.busIndex` fields are populated.

    // Values converted from fixed-point for external use
    double capacityLiters; // Volumetric capacity in Liters
    double kibbleDensity; // Kibble density in kg/L

    // Calculated values based on EEPROM data, matching the API schema
    double w_capacity_kg; // Calculated weight capacity in kilograms
    double remaining_weight_kg; // Estimated remaining weight in kilograms

    // Servo calibration data
    uint16_t servoIdlePwm;

    TankInfo()
        : uid(0ULL),
          lastBaseMAC48{ 0, 0, 0, 0, 0, 0 },
          name(""),
          busIndex(-1),
          isFullInfo(false),
          capacityLiters(0),
          kibbleDensity(0),
          w_capacity_kg(0),
          remaining_weight_kg(0),
          servoIdlePwm(1500)
    {}

  protected:
    friend class TankManager;

    enum TankInfoDiscrepancies_e : uint32_t
    {
        TID_NONE              = 0, // Nothing changed.
        TID_NAME_CHANGED      = 1, // The .name and/or .nameLength fields have changed.
        TID_SPECS_CHANGED     = 2, // One or more fields of the specs (.capacity, .density, .calibration) have changed.
        TID_MAC_CHANGED       = 4, // the base MAC addres have changed.
        TID_BUSINDEX_CHANGED  = 8, // the bus index has changed.
        TID_REMAINING_CHANGED = 16, // .remainingGrams and .notDSR have changed.
        TID_ALL = TID_NAME_CHANGED | TID_SPECS_CHANGED | TID_MAC_CHANGED | TID_BUSINDEX_CHANGED | TID_REMAINING_CHANGED, // All fields have changed.
    };

    void fillFromEeprom(TankEEpromData_t& eeprom);
    /** @brief Updates a TankEEpromData_t structure from this TankInfo's fields.
     * @returns A combination of TankInfoDiscrepancies_e flags telling which fields of the eeprom have changed.
     */
    TankInfoDiscrepancies_e toTankData(TankEEpromData_t& eeprom);
};

class TankManager {
    friend struct TankInfo;

  public:
    // Constructor now takes ServoController directly.
    TankManager(DeviceState& deviceState, SemaphoreHandle_t& mutex, ServoController* servoController)
        : _deviceState(deviceState), _mutex(mutex), _servoController(servoController), _memMux(Serial1, SWIMUX_TX_PIN, SWIMUX_RX_PIN)
    {}

    /** @brief Initialize the multiplexed OneWire setup but does not start the task. */
    void begin();
    /** @brief Refreshes the local data about connected tanks, by interrogating them. Uses lazy update. */
    void refresh() { fullRefresh(); }

    /**
     * @brief Update both local memory and eeprom so that the amount of remaining kibble is set to a new value.
     * @param uid Uid of the tank to update.
     * @param newRemainingGrams New remaining quantity of kibble, in grams.  
     * @return <true> if the operation succeeded in eeprom. Local memory is updated but not verified (no need to, it's in RAM).
     */
    bool updateRemaingKibble(const uint64_t uid, uint16_t newRemainingGrams);

    /**
     * @brief Updates the informations relative to a tank, by selecting the right bus given the provided TankInfo::uid field
     * @param[inout] tankInfo The TankInfo data to be commit to eeprom, identified by the TankInfo::uid. The TankInfo::busIndex field will be updated if the targeted tank had changed position (i.e bus index).
     * @return <true> if a the tank has been found and updated, <false> otherwise.
     */
    bool commitTankInfo(const TankInfo& tankInfo);
    /**
     * @brief Retreives the information of a tank based on the TankInfo::uid field.
     * @param[inout] tankInfo The TankInfo structure to refresh from eeprom.
     * @return <true> if a tank has been found, <false> otherwise.
     */
    bool refreshTankInfo(TankInfo& tankInfo);
    /**
     * @brief Gets the bus index of the tank with the given @p tankUid . 
     * @param tankUid Uid of the tank to get the bus index of.
     * @return Bus index [0..5] of the tank if found, -1 if no tank with the given @p tankUid has been found.
     * @note This method refreshes the presence list of the currently connected tanks.
     */
    int8_t getBusOfTank(const uint64_t tankUid);

    /**
     * @brief Puts the SwiMux interface to sleep.
     * @return <true> if successful, <false> if no response from the SwiMux.
     */
    inline bool disableSwiMux() { return _memMux.sleep(); }



    // Public method for the hardware test suite
    bool testSwiMuxAwaken(), testSwiMuxSleep(), testSwiBusUID(uint8_t index, uint64_t& result);



  private:
    static constexpr uint32_t SWIMUX_POWERUP_DELAY_MS     = 100;
    static constexpr TickType_t MUTEX_ACQUISITION_TIMEOUT = pdMS_TO_TICKS(2000);


    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ServoController* _servoController;

    // A physical interface that let us address SWI memories (AT21CS01, 128 bytes) on 6 separate SWI buses. through a 57600B8N1 uart connection.
    SwiMuxSerial_t _memMux;

    // A dedicated mutex to protect SWI bus transactions.
    SemaphoreHandle_t _swimuxMutex;

    // Internal list of tanks, which holds the comprehensive state.
    std::vector<TankInfo> _knownTanks;

    // --- Fixed-point conversion helpers ---
    static inline double q3_13_to_double(uint16_t q_val) { return (double)q_val / 8192.0; }
    static inline uint16_t double_to_q3_13(double d_val) { return (uint16_t)(d_val * 8192.0); }
    static inline double q2_14_to_double(uint16_t q_val) { return (double)q_val / 16384.0; }
    static inline uint16_t double_to_q2_14(double d_val) { return (uint16_t)(d_val * 16384.0); }

    void presenceRefresh();
    void fullRefresh();

    /** @brief Selectively updates an eeprom through the _memMux adapter. 
     * @param data Reference to the TankEEpromData_t to use as source.
     * @param updatesNeeded A combination of flags telling us which memory fields to update. 
     * @param forcedBusIndex [optional] By default, the bus to address is designated by @p data.busIndex . This parameter lets us ovveride this behavior.
     * @note The data structure in eeprom is identical to TankEEpromData_t, byte-for-byte. Thus, endianness and alignment is only relative to the host (this means us). The SwiMuxSerial_t can be seen as the simple, low-memory long-term storage it is. 
     * @remark This method will try to engage in the least amount of SwiMuxSerial_t::write transactions as possible (contiguous fields/fields groups to be updated will be written in one operation if possible). */
    void updateEeprom(TankEEpromData_t& data, TankInfo::TankInfoDiscrepancies_e updatesNeeded, int8_t forcedBusIndex = -1);
};

#endif // TANKMANAGER_HPP
