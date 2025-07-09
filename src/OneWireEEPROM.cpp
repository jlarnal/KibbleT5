#include "OneWireEEPROM.hpp"

// Define memory map for the EEPROM
#define ADDR_NAME    0x00 // 64 bytes for name
#define ADDR_DENSITY 0x40 // 4 bytes for float

OneWireEEPROM::OneWireEEPROM(OneWire* ds) : _ds(ds) {}

bool OneWireEEPROM::readBytes(const uint8_t* address, uint16_t memory_address, uint8_t* buffer, uint16_t len) {
    _ds->reset();
    _ds->select(address);
    _ds->write(EEPROM_CMD_READ);
    _ds->write(memory_address & 0xFF); // LSB
    _ds->write(memory_address >> 8);   // MSB
    for (uint16_t i = 0; i < len; i++) {
        buffer[i] = _ds->read();
    }
    // No CRC check on read data in this simple implementation
    return true;
}

bool OneWireEEPROM::writeBytes(const uint8_t* address, uint16_t memory_address, const uint8_t* buffer, uint16_t len) {
    _ds->reset();
    _ds->select(address);
    _ds->write(EEPROM_CMD_WRITE);
    _ds->write(memory_address & 0xFF); // LSB
    _ds->write(memory_address >> 8);   // MSB
    for (uint16_t i = 0; i < len; i++) {
        _ds->write(buffer[i]);
    }
    // A real implementation should wait for write completion or check status
    return true;
}

std::string OneWireEEPROM::readName(const uint8_t* address) {
    char name_buffer[65] = {0}; // 64 chars + null terminator
    if (readBytes(address, ADDR_NAME, (uint8_t*)name_buffer, 64)) {
        return std::string(name_buffer);
    }
    return "Read Failed";
}

bool OneWireEEPROM::writeName(const uint8_t* address, const std::string& name) {
    char name_buffer[64] = {0};
    strncpy(name_buffer, name.c_str(), sizeof(name_buffer) - 1);
    return writeBytes(address, ADDR_NAME, (const uint8_t*)name_buffer, sizeof(name_buffer));
}

float OneWireEEPROM::readDensity(const uint8_t* address) {
    float density = 0.0f;
    readBytes(address, ADDR_DENSITY, (uint8_t*)&density, sizeof(density));
    return density;
}

bool OneWireEEPROM::writeDensity(const uint8_t* address, float density) {
    return writeBytes(address, ADDR_DENSITY, (const uint8_t*)&density, sizeof(density));
}
