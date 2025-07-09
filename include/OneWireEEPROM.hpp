#ifndef ONEWIREEPROM_HPP
#define ONEWIREEPROM_HPP

#include <OneWire.h>
#include <string>

#define EEPROM_CMD_WRITE 0x0F
#define EEPROM_CMD_READ  0xF0

class OneWireEEPROM {
public:
    OneWireEEPROM(OneWire* ds);

    bool readBytes(const uint8_t* address, uint16_t memory_address, uint8_t* buffer, uint16_t len);
    bool writeBytes(const uint8_t* address, uint16_t memory_address, const uint8_t* buffer, uint16_t len);

    // New high-level functions
    std::string readName(const uint8_t* address);
    bool writeName(const uint8_t* address, const std::string& name);
    float readDensity(const uint8_t* address);
    bool writeDensity(const uint8_t* address, float density);


private:
    OneWire* _ds;
};

#endif // ONEWIREEPROM_HPP
