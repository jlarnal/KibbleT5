#include "OneWireEEPROM.hpp"
#include "esp_log.h"

static const char* TAG = "OneWireEEPROM";

OneWireEEPROM::OneWireEEPROM(OneWire* ds) : _ds(ds) {}

// Sets the active OneWire bus for subsequent operations.
void OneWireEEPROM::setOneWire(OneWire* ds) {
    _ds = ds;
}

bool OneWireEEPROM::readBytes(const uint8_t* address, uint16_t memory_address, uint8_t* buffer, uint16_t len) {
    _ds->reset();
    _ds->select(address);
    _ds->write(EEPROM_CMD_READ);
    _ds->write(memory_address & 0xFF); // LSB
    _ds->write(memory_address >> 8);   // MSB
    for (uint16_t i = 0; i < len; i++) {
        buffer[i] = _ds->read();
    }
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
    // Note: A robust implementation would wait for write completion or check status here.
    return true;
}

bool OneWireEEPROM::readTankData(const uint8_t* address, TankEEpromData& data) {
    return readBytes(address, 0, (uint8_t*)&data, sizeof(TankEEpromData));
}

bool OneWireEEPROM::writeTankData(const uint8_t* address, const TankEEpromData& data) {
    return writeBytes(address, 0, (const uint8_t*)&data, sizeof(TankEEpromData));
}

uint16_t OneWireEEPROM::getDispensedAmount(const uint8_t* address) {
    TankEEpromData data;
    if (!readTankData(address, data)) {
        ESP_LOGE(TAG, "Failed to read tank data to get dispensed amount.");
        return 0;
    }

    // Find the first valid dispensed amount using the fail-safe mechanism.
    for (int i = 0; i < 4; ++i) {
        if ((data.dispensedSinceRefill[i] ^ data.notDSR[i]) == 0xFFFF) {
            return data.dispensedSinceRefill[i];
        }
    }

    ESP_LOGW(TAG, "No valid dispensed amount found for tank. Returning 0.");
    return 0;
}

bool OneWireEEPROM::updateDispensedAmount(const uint8_t* address, uint16_t newAmount) {
    TankEEpromData data;
    if (!readTankData(address, data)) {
        ESP_LOGE(TAG, "Failed to read tank data to update dispensed amount.");
        return false;
    }

    // Find the current valid slot and write to the next one for wear-leveling.
    int currentSlot = -1;
    for (int i = 0; i < 4; ++i) {
        if ((data.dispensedSinceRefill[i] ^ data.notDSR[i]) == 0xFFFF) {
            currentSlot = i;
            break;
        }
    }

    int nextSlot = (currentSlot == -1) ? 0 : (currentSlot + 1) % 4;
    
    data.dispensedSinceRefill[nextSlot] = newAmount;
    data.notDSR[nextSlot] = ~newAmount; // Bitwise NOT for validation

    // Invalidate the old slot to ensure only the new one is valid.
    if (currentSlot != -1) {
        data.notDSR[currentSlot] = 0; 
    }

    return writeTankData(address, data);
}
