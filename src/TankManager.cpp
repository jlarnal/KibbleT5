#include "TankManager.hpp"
#include "DeviceState.hpp"
#include "board_pinout.h" // For ONEWIRE_MUX pins
#include "esp_log.h"
#include <algorithm>
#include <cstring>
#include <cmath>
#include <cstddef> // Required for offsetof

static const char* TAG = "TankManager";


// Helper to convert a device address to a string for logging/UID.
std::string addressToString(const uint8_t* addr)
{
    char uid_str[17];
    sprintf(uid_str, "%02X%02X%02X%02X%02X%02X%02X%02X", addr[0], addr[1], addr[2], addr[3], addr[4], addr[5], addr[6], addr[7]);
    return std::string(uid_str);
}



void TankManager::begin()
{
    _swimuxMutex = xSemaphoreCreateMutex();

    // Configure pins and their respective default levels.
    _memMux.begin();
    ESP_LOGI(TAG, "Initializing Tank Manager with SwiMux interface...");
    refresh();
}



void TankManager::presenceRefresh()
{
    RollCallArray_t presences;
    bool alreadyKnown[6] = { false, false, false, false, false, false };

    // Get the UIDs of the currently connected tanks.
    if (_memMux.rollCall(presences)) {
        if (xSemaphoreTake(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

            // Part 1: Update existing tanks and remove disconnected ones.
            // We use an iterator-based loop to safely remove elements from the vector while iterating.
            for (auto pCurrTank = _knownTanks.begin(); pCurrTank != _knownTanks.end();) {
                bool isStillPresent = false; // Assume the tank is gone until found.

                // Check if this known tank is in the list of current presences.
                for (int busIndex = 0; busIndex < 6; busIndex++) {
                    if (pCurrTank->uid == presences.bus[busIndex]) {
                        if (alreadyKnown[busIndex]) // presences.bus[busindex] already allocated to a present tank...
                            continue; // ...thus skipped.

                        // --- MATCH FOUND ---
                        isStillPresent         = true; // Mark as present.
                        pCurrTank->busIndex    = busIndex; // Update the bus busIndex.
                        alreadyKnown[busIndex] = true; // Mark this presence as accounted for.
                        break; // Move to the next known tank.
                    }
                }

                if (!isStillPresent) { // --- TANK NOT FOUND ---
                    // remove pCurrTank from our known list.
                    // The erase() method returns an iterator to the next valid element.
                    ESP_LOGI(TAG, "Tank with UID 0x%016llX is no longer present. Removing.", pCurrTank->uid);
                    pCurrTank = _knownTanks.erase(pCurrTank);
                } else {
                    // This tank is still present, so we advance the iterator to the next one.
                    ++pCurrTank;
                }
            }

            // Part 2: Add any newly discovered tanks to the list.
            for (int busIndex = 0; busIndex < 6; busIndex++) {
                // A valid UID that was not accounted for above must be a new tank.
                // We check for UID != 0 as a safeguard against empty slots.
                if (!alreadyKnown[busIndex] && presences.bus[busIndex] != 0) {
                    ESP_LOGI(TAG, "New tank with UID 0x%016llX detected on bus %d.", presences.bus[busIndex], busIndex);

                    TankInfo newTank;
                    newTank.uid        = presences.bus[busIndex];
                    newTank.busIndex   = busIndex;
                    newTank.isFullInfo = false; // Mark that we only have partial info.
                    _knownTanks.push_back(newTank);
                }
            }

            xSemaphoreGive(_swimuxMutex);
        } else {
            ESP_LOGE(TAG, "Failed to acquire SwiMux mutex to update global tank list!");
        }
    } else {
        ESP_LOGE(TAG, "TankManager::presenceRefresh roll call failed.");
    }
}

void TankInfo::fillFromEeprom(TankEEpromData_t& eeprom)
{
    // tank.uid and tank.busIndex are supposed to be already filled in (by TankManager::presenceRefresh() )
    name.clear();
    name.assign((char*)&eeprom.name[0], (size_t)eeprom.nameLength);
    capacityLiters      = TankManager::q3_13_to_double(eeprom.capacity);
    kibbleDensity       = TankManager::q2_14_to_double(eeprom.density);
    w_capacity_kg       = (kibbleDensity / capacityLiters);
    remaining_weight_kg = w_capacity_kg / (((double)(int)eeprom.remainingGrams) * 1E-3);
    servoIdlePwm        = eeprom.servoIdlePwm;
    isFullInfo          = true;
}


TankInfo::TankInfoDiscrepancies_e TankInfo::toTankData(TankEEpromData_t& eeprom)
{
    uint32_t result = TID_NONE;
    // name
    if (name.compare(0, sizeof(TankEEpromData_t::name), (char*)&eeprom.name[0]) != 0) {
        result |= TID_NAME_CHANGED;
        // Copy the length-capped name string.
        eeprom.nameLength = name.length() % (sizeof(TankEEpromData_t::name) + 1);
        strncpy((char*)&eeprom.name[0], name.c_str(), (size_t)eeprom.nameLength);
    }
    // bus index
    if (busIndex != eeprom.history.lastBusIndex) {
        result |= TID_BUSINDEX_CHANGED;
        eeprom.history.lastBusIndex = busIndex;
    }
    // MAC48 of last connected base .
    if (0 != memcmp(lastBaseMAC48, eeprom.history.lastBaseMAC48, 6)) {
        result |= TID_MAC_CHANGED;
        memcpy(eeprom.history.lastBaseMAC48, lastBaseMAC48, 6);
    }
    // Specs
    uint16_t qCap  = TankManager::double_to_q3_13(capacityLiters);
    uint16_t qDens = TankManager::double_to_q2_14(kibbleDensity);
    if (eeprom.servoIdlePwm != servoIdlePwm || eeprom.capacity != qCap || eeprom.density != qDens) {
        result |= TID_SPECS_CHANGED;
        eeprom.servoIdlePwm = servoIdlePwm;
        eeprom.capacity     = qCap;
        eeprom.density      = qDens;
    }
    // Remaining kibble
    uint32_t tankRemGrams = (uint32_t)std::abs(remaining_weight_kg * 1E-3);
    if (eeprom.remainingGrams != tankRemGrams) {
        result |= TID_REMAINING_CHANGED;
        eeprom.remainingGrams = tankRemGrams;
    }

    return (TankInfoDiscrepancies_e)result;
}




void TankManager::fullRefresh()
{
    presenceRefresh();
    TankEEpromData_t data;
    for (auto& tank : _knownTanks) {
        int retries     = 3;
        uint8_t* eeData = (uint8_t*)&data;
        do {
            if (SMREZ_OK == _memMux.read(tank.busIndex, eeData, 0, sizeof(TankEEpromData_t))) {
                tank.fillFromEeprom(data);
                break;
            }
        } while (--retries);
        if (retries <= 0) {
            ESP_LOGE(TAG, "Could not read data from tank #%d, UID 0x%016llX", tank.busIndex, tank.uid);
        }
    }
}

void TankManager::updateEeprom(TankEEpromData_t& data, TankInfo::TankInfoDiscrepancies_e updatesNeeded, int8_t forcedBusIndex)
{
    // Determine the bus index to use. If forcedBusIndex is provided (>=0), use it.
    // Otherwise, use the last known bus index from the data structure.
    const uint8_t busIndex = (forcedBusIndex >= 0) ? forcedBusIndex : data.history.lastBusIndex;

    // Validate bus index to prevent out-of-bounds access.
    if (busIndex >= 6) {
        ESP_LOGE(TAG, "updateEeprom: Invalid bus index %d. Aborting.", busIndex);
        return;
    }

    // If there's nothing to update, we can return immediately.
    if (updatesNeeded == TankInfo::TID_NONE) {
        return;
    }

    // --- Coalesce writes for header/numeric fields ---

    // Determine the minimum and maximum offsets of all changed fields to perform a single, larger write.
    int min_offset = -1;
    int max_offset = -1;

    // Helper lambda to expand the update range.
    auto update_range = [&](int start, int len) {
        if (min_offset == -1 || start < min_offset) {
            min_offset = start;
        }
        if (max_offset == -1 || (start + len) > max_offset) {
            max_offset = start + len;
        }
    };

    if (updatesNeeded & TankInfo::TID_MAC_CHANGED) {
        update_range(offsetof(TankEEpromData_t, history.lastBaseMAC48), sizeof(data.history.lastBaseMAC48));
        }
    if (updatesNeeded & TankInfo::TID_BUSINDEX_CHANGED) {
        update_range(offsetof(TankEEpromData_t, history.lastBusIndex), sizeof(data.history.lastBusIndex));
    }
    // nameLength is part of the name change flag
    if (updatesNeeded & TankInfo::TID_NAME_CHANGED) {
        update_range(offsetof(TankEEpromData_t, nameLength), sizeof(data.nameLength));
    }
    if (updatesNeeded & TankInfo::TID_SPECS_CHANGED) {
        // This covers the contiguous block of capacity, density, and servoIdlePwm
        update_range(offsetof(TankEEpromData_t, capacity), sizeof(data.capacity) + sizeof(data.density) + sizeof(data.servoIdlePwm));
        }
    if (updatesNeeded & TankInfo::TID_REMAINING_CHANGED) {
        update_range(offsetof(TankEEpromData_t, remainingGrams), sizeof(data.remainingGrams));
    }

    uint8_t* eepromBytes = reinterpret_cast<uint8_t*>(&data);

    // If any of the header/numeric fields changed, perform a single coalesced write.
    if (min_offset != -1) {
        uint8_t len    = max_offset - min_offset;
        uint8_t* pData = eepromBytes + min_offset;
        if (SMREZ_OK != _memMux.write(busIndex, pData, min_offset, len)) {
            ESP_LOGE(TAG, "Failed to write coalesced eeprom block (offset: %d, len: %d) for tank on bus %d", min_offset, len, busIndex);
        }
    }

    // --- Handle the name array separately ---
    // It's large, variable-length, and at the end of the structure, so it's best to handle it with its own write.
    if (updatesNeeded & TankInfo::TID_NAME_CHANGED) {
        if (data.nameLength > 0 && data.nameLength <= sizeof(data.name)) {
            const uint8_t nameOffset = offsetof(TankEEpromData_t, name);
            uint8_t* pName           = eepromBytes + nameOffset;
            if (SMREZ_OK != _memMux.write(busIndex, pName, nameOffset, data.nameLength)) {
                ESP_LOGE(TAG, "Failed to write name content for tank on bus %d", busIndex);
            }
        }
    }
}


int8_t TankManager::getBusOfTank(const uint64_t tankUid)
{
    presenceRefresh();
    for (const auto& tank : _knownTanks) {
        if (tank.uid == tankUid)
            return tank.busIndex;
    }
    return -1;
}

// Handles updating the tank's configuration in its EEPROM.
bool TankManager::commitTankInfo(const TankInfo& tankInfo)
{
    // 1. Find the bus where the tank is currently connected.
    int8_t busIndex = getBusOfTank(tankInfo.uid);
    if (busIndex < 0) {
        ESP_LOGE(TAG, "commitTankInfo: Tank with UID 0x%016llX not found.", tankInfo.uid);
        return false;
    }

    // 2. Read the current data from the EEPROM to establish a baseline.
    TankEEpromData_t currentEepromData;
    uint8_t* eeData = reinterpret_cast<uint8_t*>(&currentEepromData);
    if (SMREZ_OK != _memMux.read(busIndex, eeData, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "commitTankInfo: Failed to read from tank on bus %d", busIndex);
        return false;
    }

    // 3. Create a mutable copy to call toTankData, which modifies the eeprom struct
    // and returns flags indicating what has changed.
    TankInfo mutableTankInfo = tankInfo;
    mutableTankInfo.busIndex = busIndex; // Ensure the busIndex is up-to-date for comparison.
    TankInfo::TankInfoDiscrepancies_e updatesNeeded = mutableTankInfo.toTankData(currentEepromData);

    // 4. If there are changes, write them back using our optimized method.
    if (updatesNeeded != TankInfo::TID_NONE) {
        ESP_LOGI(TAG, "Committing changes (flags: 0x%X) to tank 0x%016llX on bus %d", (uint32_t)updatesNeeded, tankInfo.uid, busIndex);
        updateEeprom(currentEepromData, updatesNeeded, busIndex);
    } else {
        ESP_LOGI(TAG, "No changes to commit for tank 0x%016llX", tankInfo.uid);
    }

    return true;
}

bool TankManager::refreshTankInfo(TankInfo& tankInfo)
{
    // 1. The UID must be provided in the tankInfo struct.
    if (tankInfo.uid == 0) {
        ESP_LOGE(TAG, "refreshTankInfo: UID must be provided.");
    return false;
    }
    
    // 2. Find which bus the tank is on. This also refreshes the presence list.
    int8_t busIndex = getBusOfTank(tankInfo.uid);
    if (busIndex < 0) {
        ESP_LOGW(TAG, "refreshTankInfo: Tank with UID 0x%016llX not found.", tankInfo.uid);
        return false;
    }

    // 3. Read the entire EEPROM data block from the tank.
    TankEEpromData_t eepromData;
    uint8_t* eeData = reinterpret_cast<uint8_t*>(&eepromData);
    if (SMREZ_OK != _memMux.read(busIndex, eeData, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "refreshTankInfo: Failed to read from tank on bus %d", busIndex);
        return false;
    }

    // 4. Populate the passed-in TankInfo object with the data from the EEPROM.
    tankInfo.fillFromEeprom(eepromData);
    // fillFromEeprom doesn't set the busIndex, so we must set it manually.
    tankInfo.busIndex = busIndex;

    ESP_LOGI(TAG, "Refreshed info for tank 0x%016llX on bus %d", tankInfo.uid, busIndex);
    return true;
}

bool TankManager::updateRemaingKibble(const uint64_t uid, uint16_t newRemainingGrams)
{
    // 1. Find the tank. This also refreshes the presence list.
    int8_t busIndex = getBusOfTank(uid);
    if (busIndex < 0) {
        ESP_LOGE(TAG, "updateRemaingKibble: Tank with UID 0x%016llX not found.", uid);
        return false;
    }

    // 2. Update the local in-memory cache (_knownTanks).
    bool foundInCache = false;
    for (auto& tank : _knownTanks) {
        if (tank.uid == uid) {
            tank.remaining_weight_kg = (double)newRemainingGrams / 1000.0;
            foundInCache             = true;
            break;
        }
    }

    if (!foundInCache) {
        // This case is unlikely if getBusOfTank succeeded, but it's a good safeguard.
        ESP_LOGE(TAG, "updateRemaingKibble: Tank 0x%016llX found on bus but not in cache. This indicates a sync issue.", uid);
    }

    // 3. Write the new value directly to the EEPROM.
    const uint8_t offset = offsetof(TankEEpromData_t, remainingGrams);
    uint8_t* pData       = reinterpret_cast<uint8_t*>(&newRemainingGrams);

    if (SMREZ_OK == _memMux.write(busIndex, pData, offset, sizeof(newRemainingGrams))) {
        ESP_LOGI(TAG, "Updated remaining kibble for tank 0x%016llX to %d grams.", uid, newRemainingGrams);
        return true;
    }

    ESP_LOGE(TAG, "Failed to write remaining kibble for tank 0x%016llX on bus %d", uid, busIndex);
    return false;
}


#pragma region Test methods for debug, to be commented out upon release



bool TankManager::testSwiMuxAwaken()
{

    ESP_LOGI(TAG, "Poking SwiMux...\n");

    if (xSemaphoreTake(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

        bool result = _memMux.isAwake();
        xSemaphoreGive(_swimuxMutex);
        ESP_LOGI(TAG, "Awakening of SwiMux %s", (result ? "successful." : "FAILED !"));
        return result;
    } else {
        ESP_LOGE(TAG, "Error: Could not acquire SwiMux mutex for test.");
    }

    return false;
}

bool TankManager::testSwiMuxSleep()
{

    ESP_LOGI(TAG, "Putting SwiMux to sleep.\n");

    if (xSemaphoreTake(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

        bool result = _memMux.sleep();
        xSemaphoreGive(_swimuxMutex);
        ESP_LOGI(TAG, "Putting SwiMux to sleep %s", (result ? "successful." : "FAILED !"));
        return result;
    } else {
        ESP_LOGE(TAG, "Error: Could not acquire SwiMux mutex for test.");
    }

    return false;
}

bool TankManager::testSwiBusUID(uint8_t index, uint64_t& result)
{
    ESP_LOGI(TAG, "Putting SwiMux to sleep.\n");

    if (xSemaphoreTake(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

        bool success = SwiMuxResult_e::SMREZ_OK == _memMux.getUid(index % 6, result);
        xSemaphoreGive(_swimuxMutex);
        ESP_LOGI(TAG, "Putting SwiMux to sleep %s", (success ? "successful." : "FAILED !"));
        return success;
    } else {
        ESP_LOGE(TAG, "Error: Could not acquire SwiMux mutex for test.");
    }

    return false;
}

#pragma endregion
