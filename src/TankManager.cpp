#include "TankManager.hpp"
#include "DeviceState.hpp" 
#include "board_pinout.h" // For g_OneWireBusesPin
#include "esp_log.h"
#include <algorithm>
#include <cstring>

static const char* TAG = "TankManager";

// Helper to convert a device address to a string for logging/UID.
std::string addressToString(const uint8_t* addr) {
    char uid_str[17];
    sprintf(uid_str, "%02X%02X%02X%02X%02X%02X%02X%02X", 
            addr[0], addr[1], addr[2], addr[3], 
            addr[4], addr[5], addr[6], addr[7]);
    return std::string(uid_str);
}

// Constructor now initializes the OneWire buses and the EEPROM controller.
TankManager::TankManager(DeviceState& deviceState, SemaphoreHandle_t& mutex, 
                         ServoController* servoController)
    : _deviceState(deviceState), _mutex(mutex), 
      _servoController(servoController) {
    for (int i = 0; i < 6; ++i) {
        _oneWireBuses[i] = new OneWire(g_OneWireBusesPin[i]);
    }
    // Note: The EEPROM controller uses a single OneWire instance at a time,
    // which we will manage before each operation. We pass the first bus as a default.
    _eepromController = new OneWireEEPROM(_oneWireBuses[0]);
}

void TankManager::begin() {
    ESP_LOGI(TAG, "Initializing Tank Manager with multi-bus support...");
    _discoverAndSyncTanks();
}

void TankManager::startTask() {
    xTaskCreate(
        _tankDiscoveryTask,
        "Tank Discovery Task",
        4096, 
        this, 
        4,
        NULL
    );
}

// Gets the ordinal (which corresponds to the servo ID) for a given tank UID.
uint8_t TankManager::getOrdinalForTank(const std::string& tankUid) {
    auto it = std::find_if(_knownTanks.begin(), _knownTanks.end(), 
        [&tankUid](const TankInfo& tank){ return tank.uid == tankUid; });

    if (it != _knownTanks.end()) {
        return it->ordinal;
    }
    return 255; // Return an invalid ordinal/ID if not found
}

bool TankManager::setTankName(uint8_t ordinal, const std::string& newName) {
    // Find the tank by its ordinal.
    auto it = std::find_if(_knownTanks.begin(), _knownTanks.end(), 
        [ordinal](const TankInfo& tank){ return tank.ordinal == ordinal; });

    if (it == _knownTanks.end() || !it->connected) {
        ESP_LOGE(TAG, "Cannot set name for disconnected or unknown tank at ordinal %d", ordinal);
        return false;
    }

    uint8_t addr[8];
    sscanf(it->uid.c_str(), "%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx", 
           &addr[0], &addr[1], &addr[2], &addr[3], 
           &addr[4], &addr[5], &addr[6], &addr[7]);

    TankEEpromData eepromData;
    _eepromController->setOneWire(_oneWireBuses[ordinal]); // Point to the correct bus
    if (!_eepromController->readTankData(addr, eepromData)) {
        ESP_LOGE(TAG, "Failed to read EEPROM for tank %s to update name.", it->uid.c_str());
        return false;
    }

    // Update the name and length field.
    eepromData.nameLength = std::min((size_t)95, newName.length());
    strncpy((char*)eepromData.name, newName.c_str(), 96);
    eepromData.name[95] = '\0'; // Ensure null termination.

    if (_eepromController->writeTankData(addr, eepromData)) {
        it->name = newName; // Update in-memory cache
        ESP_LOGI(TAG, "Successfully updated name for tank %s to '%s'", it->uid.c_str(), newName.c_str());
        return true;
    }
    
    ESP_LOGE(TAG, "Failed to write new name to EEPROM for tank %s", it->uid.c_str());
    return false;
}

void TankManager::_tankDiscoveryTask(void* pvParameters) {
   TankManager* instance = (TankManager*)pvParameters;
    size_t refreshCount   = 0;
    ESP_LOGI(TAG, "Tank Discovery Task started.");

    for (;;) {
        instance->_discoverAndSyncTanks();
        refreshCount++;
        if (refreshCount % 20 == 0) {
            ESP_LOGI(TAG, "Tank discovery #%u...", refreshCount);
        }
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void TankManager::_discoverAndSyncTanks() {
    std::vector<TankInfo> discoveredTanks;

    // Iterate through each of the 6 1-Wire buses.
    for (int i = 0; i < 6; ++i) {
        OneWire* bus = _oneWireBuses[i];
        _eepromController->setOneWire(bus); // Important: point the EEPROM controller to the current bus.
        bus->reset_search();
        uint8_t addr[8];

        // Search for a device on the current bus. We only expect one per bus.
        if (bus->search(addr)) {
            if (OneWire::crc8(addr, 7) != addr[7]) {
                ESP_LOGW(TAG, "Bus %d: Found device with invalid CRC. Skipping.", i);
                continue;
            }

            std::string current_uid = addressToString(addr);
            TankInfo discoveredTank;
            discoveredTank.uid = current_uid;
            discoveredTank.ordinal = i;
            discoveredTank.connected = true;

            // Read the data struct from the EEPROM.
            TankEEpromData eepromData;
            if (_eepromController->readTankData(addr, eepromData)) {
                // Populate the TankInfo struct with converted and calculated values.
                discoveredTank.name = std::string((char*)eepromData.name, eepromData.nameLength);
                discoveredTank.capacityLiters = q3_13_to_double(eepromData.capacity);
                discoveredTank.kibbleDensity = q2_14_to_double(eepromData.density);
                discoveredTank.servoIdlePwm = eepromData.calibration;
                
                uint16_t dispensedGrams = _eepromController->getDispensedAmount(addr);
                
                discoveredTank.w_capacity_kg = discoveredTank.capacityLiters * discoveredTank.kibbleDensity;
                double dispensed_kg = (double)dispensedGrams / 1000.0;
                
                discoveredTank.remaining_weight_kg = std::max(0.0, discoveredTank.w_capacity_kg - dispensed_kg);

            } else {
                ESP_LOGE(TAG, "Bus %d: Failed to read EEPROM data for tank %s.", i, current_uid.c_str());
                // Populate with default/error values
                discoveredTank.name = "Read Error";
                // ... set other fields to safe defaults
            }
            discoveredTanks.push_back(discoveredTank);
        }
    }

    // Compare with the known list and update the global state if changed.
    bool stateChanged = false;
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        if (_knownTanks.size() != discoveredTanks.size()) {
            stateChanged = true;
        } else {
            for (size_t i = 0; i < discoveredTanks.size(); ++i) {
                if (discoveredTanks[i].uid != _knownTanks[i].uid) {
                    stateChanged = true;
                    break;
                }
            }
        }

        if (stateChanged) {
            _knownTanks = discoveredTanks;
            _deviceState.connectedTanks = _knownTanks; // Update global state
            ESP_LOGI(TAG, "Tank configuration changed. Now tracking %d tanks.", _knownTanks.size());
        }
        xSemaphoreGive(_mutex);
    } else {
        ESP_LOGE(TAG, "Failed to acquire mutex to update global tank list!");
    }
}

// --- Fixed-point conversion helpers ---

double TankManager::q3_13_to_double(uint16_t q_val) {
    return (double)q_val / 8192.0;
}

uint16_t TankManager::double_to_q3_13(double d_val) {
    return (uint16_t)(d_val * 8192.0);
}

double TankManager::q2_14_to_double(uint16_t q_val) {
    return (double)q_val / 16384.0;
}

uint16_t TankManager::double_to_q2_14(double d_val) {
    return (uint16_t)(d_val * 16384.0);
}
