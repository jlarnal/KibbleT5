#include "TankManager.hpp"
#include "DeviceState.hpp"
#include "esp_log.h"
#include <algorithm>

static const char* TAG = "TankManager";

std::string addressToString(const uint8_t* addr)
{
    char uid_str[17];
    sprintf(uid_str, "%02X%02X%02X%02X%02X%02X%02X%02X", addr[0], addr[1], addr[2], addr[3], addr[4], addr[5], addr[6], addr[7]);
    return std::string(uid_str);
}

TankManager::TankManager(
  DeviceState& deviceState, SemaphoreHandle_t& mutex, OneWire* oneWire, OneWireEEPROM* eepromController, ServoController* servoController)
    : _deviceState(deviceState), _mutex(mutex), _oneWire(oneWire), _eepromController(eepromController), _servoController(servoController)
{}

void TankManager::begin()
{
    ESP_LOGI(TAG, "Initializing Tank Manager...");
    _discoverAndSyncTanks();
}

void TankManager::startTask()
{
    // The tank discovery task has low priority.
    xTaskCreate(_tankDiscoveryTask, "Tank Discovery Task", 4096, this, 4, NULL);
}

uint8_t TankManager::getServoIdForTank(const std::string& tankUid)
{
    auto it = std::find_if(_knownTanks.begin(), _knownTanks.end(), [&tankUid](const TankInfo& tank) { return tank.uid == tankUid; });

    if (it != _knownTanks.end()) {
        return it->servoId;
    }
    return 255;
}

bool TankManager::setTankName(const std::string& uid, const std::string& newName)
{
    uint8_t addr[8];
    sscanf(uid.c_str(), "%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx", &addr[0], &addr[1], &addr[2], &addr[3], &addr[4], &addr[5], &addr[6], &addr[7]);

    if (_eepromController->writeName(addr, newName)) {
        for (auto& tank : _knownTanks) {
            if (tank.uid == uid) {
                tank.name = newName;
                break;
            }
        }
        ESP_LOGI(TAG, "Successfully updated name for tank %s to '%s'", uid.c_str(), newName.c_str());
        return true;
    }

    ESP_LOGE(TAG, "Failed to write new name to EEPROM for tank %s", uid.c_str());
    return false;
}

void TankManager::_tankDiscoveryTask(void* pvParameters)
{
    TankManager* instance = (TankManager*)pvParameters;
    size_t refreshCount   = 0;
    ESP_LOGI(TAG, "Tank Discovery Task started.");

    for (;;) {
        instance->_discoverAndSyncTanks();
        refreshCount++;
        if (refreshCount % 20 == 0) {
            ESP_LOGI(TAG, "Tank discovery #%u...", refreshCount);
        }
        vTaskDelay(pdMS_TO_TICKS(1000)); // Run each second.
    }
}

void TankManager::_discoverAndSyncTanks()
{
    _oneWire->reset_search();
    uint8_t addr[8];

    for (auto& tank : _knownTanks) {
        tank.connected = false;
    }

    while (_oneWire->search(addr)) {
        if (OneWire::crc8(addr, 7) != addr[7]) {
            ESP_LOGW(TAG, "1-Wire device found with invalid CRC. Skipping.");
            continue;
        }

        std::string current_uid = addressToString(addr);
        ESP_LOGI(TAG, "Found 1-Wire device with UID: %s", current_uid.c_str());

        auto it = std::find_if(_knownTanks.begin(), _knownTanks.end(), [&current_uid](const TankInfo& tank) { return tank.uid == current_uid; });

        if (it != _knownTanks.end()) {
            it->connected = true;
            ESP_LOGI(TAG, "Re-discovered known tank: %s", current_uid.c_str());
        } else {
            ESP_LOGI(TAG, "Discovered new tank: %s", current_uid.c_str());
            TankInfo newTank;
            newTank.uid       = current_uid;
            newTank.connected = true;

            newTank.servoId = _knownTanks.size() + 1;

            newTank.name          = _eepromController->readName(addr);
            newTank.kibbleDensity = _eepromController->readDensity(addr);
            newTank.level         = 50;

            _knownTanks.push_back(newTank);
        }
    }

    bool stateChanged = false;
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        if (_deviceState.connectedTanks.size() != _knownTanks.size()) {
            stateChanged = true;
        } else {
            for (size_t i = 0; i < _knownTanks.size(); ++i) {
                if (_knownTanks[i].uid != _deviceState.connectedTanks[i].uid
                  || _knownTanks[i].connected != _deviceState.connectedTanks[i].connected) {
                    stateChanged = true;
                    break;
                }
            }
        }

        if (stateChanged) {
            _deviceState.connectedTanks = _knownTanks;
            ESP_LOGI(TAG, "Global device state updated with %d tanks.", _knownTanks.size());
        }
        xSemaphoreGive(_mutex);
    } else {
        ESP_LOGE(TAG, "Failed to acquire mutex to update global tank list!");
    }
}
