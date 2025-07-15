#ifndef ONEWIREEPROM_HPP
#define ONEWIREEPROM_HPP

#include <OneWire.h>
#include <string>
#include <cstdint>

#define EEPROM_CMD_WRITE 0x0F
#define EEPROM_CMD_READ  0xF0

// Data structure for the tank's EEPROM, aligned with the new specification.
typedef struct TankEEpromData_t{
	// UID is dismissed, since it's already read-only and always present in the 1-wire EEPROM chip.
	uint16_t capacity; // Capacity, in liters, as an unsigned Q3.13 number.
	uint16_t density; // A Q2.14 unsigned fixed number for kibble density in kg/L.
	uint16_t calibration; // The PWM value (in microseconds) for the servo's idle position.	
	uint8_t nameLength; // The length of the UTF-8 string stored in the `name` field.
	uint8_t name[96]; // The name of the tank in UTF-8.
	uint16_t dispensedSinceRefill[4]; // Dispensed kibble in grams, with redundancy.
	uint16_t notDSR[4]; // Bitwise negated copies for validation.
} TankEEpromData;

class OneWireEEPROM {
public:
    // The constructor now takes a pointer to a OneWire object.
    // The specific bus will be handled by the caller (TankManager).
    OneWireEEPROM(OneWire* ds);

    // Allows the TankManager to switch the active 1-Wire bus.
    void setOneWire(OneWire* ds);

    // Low-level byte read/write functions remain for flexibility.
    bool readBytes(const uint8_t* address, uint16_t memory_address, uint8_t* buffer, uint16_t len);
    bool writeBytes(const uint8_t* address, uint16_t memory_address, const uint8_t* buffer, uint16_t len);

    // High-level functions to manage the entire TankEEpromData struct.
    bool readTankData(const uint8_t* address, TankEEpromData& data);
    bool writeTankData(const uint8_t* address, const TankEEpromData& data);

    // Functions to manage the fail-safe dispensedSinceRefill value.
    uint16_t getDispensedAmount(const uint8_t* address);
    bool updateDispensedAmount(const uint8_t* address, uint16_t newAmount);

private:
    OneWire* _ds;
};

#endif // ONEWIREEPROM_HPP
