#include "TankManager.hpp"
#include "DeviceState.hpp"
#include "board_pinout.h" 
#include "esp_log.h"
#include <algorithm>
#include <cstring>
#include <cmath>
#include <cstddef> // Required for offsetof

static const char* TAG = "TankManager";

TaskHandle_t TankManager::_runningTask;
// Uncomment this symbol definition if you want to simplify the most frequent updates (at the price of more eeprom wear).
// #define TANK_EEPROM_CRC_IGNORES_REMAININ_GRAMS

// Helper to convert a device address to a string for logging/UID.
std::string addressToString(const uint8_t* addr)
{
    char uid_str[17];
    sprintf(uid_str, "%02X%02X%02X%02X%02X%02X%02X%02X", addr[0], addr[1], addr[2], addr[3], addr[4], addr[5], addr[6], addr[7]);
    return std::string(uid_str);
}

void TankEEpromData_t::make_crc32(uint32_t& crc, const uint8_t val) {}

uint32_t TankEEpromData_t::getCrc32(TankEEpromData_t& eedata, uint8_t recordIndex)
{
    uint8_t* pRcd      = (uint8_t*)&eedata.records[recordIndex & 1];
    uint32_t resultCrc = TankEEpromData_t::CRC_INIT_VALUE;

    for (int idx = 0; idx < TankEEpromData_t::CRC_COMPUTATION_SPAN; idx++) {
#ifdef TANK_EEPROM_CRC_IGNORES_REMAININ_GRAMS
        if (idx = offsetof(TankEEpromData_t::_RECORD_, remainingGrams)) { // always skip the `remainingGrams` field
            idx += sizeof(TankEEpromData_t::_RECORD_::remainingGrams);
        }
#endif
        bool carries = resultCrc & 0x8000000U ? 1U : 0U;
        resultCrc <<= 1;
        if (carries)
            resultCrc |= 1U;
        resultCrc ^= pRcd[idx];
        resultCrc ^= 0xBB40E64D;
    }

    return resultCrc;
}

void TankEEpromData_t::finalize(TankEEpromData_t& eedata, uint8_t recordToKeep)
{
    recordToKeep &= 1; // clamp
    { // Compute and save the crc.
        uint32_t crc                     = TankEEpromData_t::getCrc32(eedata, recordToKeep);
        eedata.records[recordToKeep].crc = crc;
    }
    { // Copy source to dest, depending on the record to keep.
        uint8_t* dest = (uint8_t*)&eedata.records[(recordToKeep & 1) ^ 1];
        uint8_t* src  = (uint8_t*)&eedata.records[(recordToKeep & 1)];
        memcpy(dest, src, sizeof(TankEEpromData_t));
    }
}


bool TankEEpromData_t::sanitize(TankEEpromData_t& eedata)
{
    if (memcmp(&eedata.records[0], &eedata.records[1], sizeof(TankEEpromData_t::_RECORD_)) != 0 // records do not match ?
      || eedata.records[0].nameLength > sizeof(TankEEpromData_t::_RECORD_::name) // string length of record[0] is too long.
      || eedata.records[1].nameLength > sizeof(TankEEpromData_t::_RECORD_::name) // string length of record[1] is too long.
      || eedata.records[0].history.lastBusIndex > 6 // record[0] bus index is out of range.
      || eedata.records[1].history.lastBusIndex > 6 // record[1] bus index is out of range.
    ) {

        uint32_t crc0 = TankEEpromData_t::getCrc32(eedata, 0);
        uint32_t crc1 = TankEEpromData_t::getCrc32(eedata, 1);
        crc0 ^= eedata.records[0].crc;
        crc1 ^= eedata.records[1].crc;
        if (crc0 && crc1) { // both invalid !!! Crap !
            // Just purge them both.
            memset(&eedata, 0, sizeof(TankEEpromData_t));
            return false;
        } else if (crc0) { // record[0] is invalid, overwrite it with records[1]
            memcpy(&eedata.records[0], &eedata.records[1], sizeof(TankEEpromData_t::_RECORD_));
        } else if (crc1) { // record[1] is invalid, overwrite it with records[0]
            memcpy(&eedata.records[1], &eedata.records[0], sizeof(TankEEpromData_t::_RECORD_));
        } else { // both record are sane, nothing to do here.
        }
    }
    return true;
}


void TankManager::begin(uint16_t hopper_closed_pwm, uint16_t hopper_open_pwm)
{
    _hopperClosedPwm = hopper_closed_pwm;
    _hopperOpenPwm = hopper_open_pwm;
    _isServoMode = false;

    _swimuxMutex = xSemaphoreCreateRecursiveMutex();

    // Init PCA9685
    _pwm.begin();

    // Configure pins and their respective default levels.
    _swiMux.begin();
    
    pinMode(SERVO_POWER_ENABLE_PIN, OUTPUT);
    digitalWrite(SERVO_POWER_ENABLE_PIN, HIGH); // Start with power off (HIGH for active-low)
    
    _switchToSwiMode(); // Set PCA9685 to SWI mode by default
    
    ESP_LOGI(TAG, "Initializing Tank Manager with SwiMux interface...");
    refresh();
}

void TankManager::_switchToSwiMode() {
    _pwm.setPWMFreq(100); // Low frequency for DC power
    for (int i = 0; i < 16; i++) {
        _pwm.setPWM(i, 4095, 0); // 100% duty cycle to power SWI pull-ups
    }
    _isServoMode = false;
    ESP_LOGI(TAG, "PCA9685 switched to SWI power mode.");
}

void TankManager::_switchToServoMode() {
    _pwm.setPWMFreq(50); // Standard servo frequency
    _isServoMode = true;
    ESP_LOGI(TAG, "PCA9685 switched to Servo PWM mode.");
}

void TankManager::_tankDetectionTask(void* pvParam)
{
    if (pvParam == nullptr)
        return;
    TankManager* pInst = (TankManager*)pvParam;
    SwiMuxPresenceReport_t currReport;
    while (1) {
        if (pInst->_swiMux.isAsleep() && !pInst->_isServoMode) {
            currReport = pInst->_lastPresenceReport;
            if (xSemaphoreTakeRecursive(pInst->_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {
                if (pInst->_swiMux.hasEvents(&currReport)) {
                    currReport ^= pInst->_lastPresenceReport;
                }
                xSemaphoreGiveRecursive(pInst->_swimuxMutex);
            }
            if (currReport.busesCount)
                pInst->refresh(currReport.presences);
        }
        vTaskDelay(pdMS_TO_TICKS(250));
    }
}


void TankManager::presenceRefresh()
{
    if(_isServoMode) {
        ESP_LOGW(TAG, "Cannot refresh tank presence while in servo mode.");
        return;
    }

    RollCallArray_t presences;
    bool alreadyKnown[6] = { false, false, false, false, false, false };

    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {
        // Get the UIDs of the currently connected tanks.
        if (_swiMux.rollCall(presences)) {
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
        } else {
            ESP_LOGE(TAG, "TankManager::presenceRefresh roll call failed.");
        }
        xSemaphoreGiveRecursive(_swimuxMutex);
    } else {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex to update global tank list!");
    }
}

void TankInfo::fillFromEeprom(TankEEpromData_t& eeprom)
{
    // Sanitize eepromData beforehand

    TankEEpromData_t::sanitize(eeprom);


    // tank.uid and tank.busIndex are supposed to be already filled in (by TankManager::presenceRefresh() )
    name.clear();
    name.assign((char*)&eeprom.records[0].name[0], (size_t)eeprom.records[0].nameLength);
    capacityLiters = TankManager::q3_13_to_double(eeprom.records[0].capacity);
    kibbleDensity  = TankManager::q2_14_to_double(eeprom.records[0].density);
    w_capacity_kg  = (kibbleDensity / capacityLiters);
    if (eeprom.records[0].remainingGrams > 1.0) {
        remaining_weight_kg = w_capacity_kg / (((double)(int)eeprom.records[0].remainingGrams) * 1E-3);
    } else {
        remaining_weight_kg = 0;
    }
    servoIdlePwm = eeprom.records[0].servoIdlePwm;
    isFullInfo   = true;
}


TankInfo::TankInfoDiscrepancies_e TankInfo::toTankData(TankEEpromData_t& eeprom)
{
    uint32_t result = TID_NONE;
    // name
    if (name.compare(0, sizeof(TankEEpromData_t::_RECORD_::name), (char*)&eeprom.records[0].name[0]) != 0) {
        result |= TID_NAME_CHANGED;
        // Copy the length-capped name string.
        eeprom.records[0].nameLength = name.length() % (sizeof(TankEEpromData_t::_RECORD_::name) + 1);
        strncpy((char*)&eeprom.records[0].name[0], name.c_str(), (size_t)eeprom.records[0].nameLength);
    }
    // bus index
    if (busIndex != eeprom.records[0].history.lastBusIndex) {
        result |= TID_BUSINDEX_CHANGED;
        eeprom.records[0].history.lastBusIndex = busIndex;
    }
    // MAC48 of last connected base .
    if (0 != memcmp(lastBaseMAC48, eeprom.records[0].history.lastBaseMAC48, 6)) {
        result |= TID_MAC_CHANGED;
        memcpy(eeprom.records[0].history.lastBaseMAC48, lastBaseMAC48, 6);
    }
    // Specs
    uint16_t qCap  = TankManager::double_to_q3_13(capacityLiters);
    uint16_t qDens = TankManager::double_to_q2_14(kibbleDensity);
    if (eeprom.records[0].servoIdlePwm != servoIdlePwm || eeprom.records[0].capacity != qCap || eeprom.records[0].density != qDens) {
        result |= TID_SPECS_CHANGED;
        eeprom.records[0].servoIdlePwm = servoIdlePwm;
        eeprom.records[0].capacity     = qCap;
        eeprom.records[0].density      = qDens;
    }
    // Remaining kibble
    uint32_t tankRemGrams = (uint32_t)std::abs(remaining_weight_kg * 1E-3);
    if (eeprom.records[0].remainingGrams != tankRemGrams) {
        result |= TID_REMAINING_CHANGED;
        eeprom.records[0].remainingGrams = tankRemGrams;
    }

    // Compute eeprom.records[0]'s crc and copy eeprom.records[0] over to eeprom.records[1].
    TankEEpromData_t::finalize(eeprom, 0);

    return (TankInfoDiscrepancies_e)result;
}



void TankManager::fullRefresh()
{
    if(_isServoMode) return;
    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {
        presenceRefresh();
        TankEEpromData_t data;
        for (auto& tank : _knownTanks) {
            int retries     = 3;
            uint8_t* eeData = (uint8_t*)&data;
            do {
                if (SMREZ_OK == _swiMux.read(tank.busIndex, eeData, 0, sizeof(TankEEpromData_t))) {
                    tank.fillFromEeprom(data);
                    break;
                }
            } while (--retries);
            if (retries <= 0) {
                ESP_LOGE(TAG, "Could not read data from tank #%d, UID 0x%016llX", tank.busIndex, tank.uid);
            }
        }
        xSemaphoreGiveRecursive(_swimuxMutex);
    } else {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex for fullRefresh!");
    }
}

bool TankManager::updateEeprom(TankEEpromData_t& data, TankInfo::TankInfoDiscrepancies_e updatesNeeded, int8_t forcedBusIndex)
{
    if(_isServoMode) return false;
    // Determine the bus index to use. If forcedBusIndex is provided (>=0), use it.
    // Otherwise, use the last known bus index from the data structure.
    uint8_t busIndex = (forcedBusIndex >= 0) ? forcedBusIndex : data.records[0].history.lastBusIndex;
    busIndex %= 6;

    // If there's nothing to update, we can return immediately.
    if (updatesNeeded == TankInfo::TID_NONE) {
        return true;
    }

    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) != pdTRUE) {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex for updateEeprom!");
        return false;
    }

    // --- Write the whole data in one fell swoop.

    uint8_t* eepromBytes = reinterpret_cast<uint8_t*>(&data);
    TankEEpromData_t::finalize(data); // prepare the data to be transfered to eeprom (duplicate and crc32 addition)

    // If any of the header/numeric fields changed, perform a single coalesced write.
    if (SMREZ_OK != _swiMux.write(busIndex, eepromBytes, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "Failed to write memory of tank #%d", busIndex);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    xSemaphoreGiveRecursive(_swimuxMutex);
    return true;
}


int8_t TankManager::getBusOfTank(const uint64_t tankUid)
{
    if(_isServoMode) return -1;
    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) != pdTRUE) {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex for getBusOfTank!");
        return -1;
    }

    presenceRefresh();
    for (const auto& tank : _knownTanks) {
        if (tank.uid == tankUid) {
            xSemaphoreGiveRecursive(_swimuxMutex);
            return tank.busIndex;
        }
    }

    xSemaphoreGiveRecursive(_swimuxMutex);
    return -1;
}

// Handles updating the tank's configuration in its EEPROM.
bool TankManager::commitTankInfo(const TankInfo& tankInfo)
{
    if(_isServoMode) return false;
    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) != pdTRUE) {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex for commitTankInfo!");
        return false;
    }

    // 1. Find the bus where the tank is currently connected.
    int8_t busIndex = getBusOfTank(tankInfo.uid);
    if (busIndex < 0) {
        ESP_LOGE(TAG, "commitTankInfo: Tank with UID 0x%016llX not found.", tankInfo.uid);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    // 2. Read the current data from the EEPROM to establish a baseline.
    TankEEpromData_t currentEepromData;
    uint8_t* eeData = reinterpret_cast<uint8_t*>(&currentEepromData);
    if (SMREZ_OK != _swiMux.read(busIndex, eeData, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "commitTankInfo: Failed to read from tank on bus %d", busIndex);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    // 3. Create a mutable copy to call toTankData, which modifies the eeprom struct
    // and returns flags indicating what has changed.
    TankInfo mutableTankInfo                        = tankInfo;
    mutableTankInfo.busIndex                        = busIndex; // Ensure the busIndex is up-to-date for comparison.
    TankInfo::TankInfoDiscrepancies_e updatesNeeded = mutableTankInfo.toTankData(currentEepromData);

    // 4. If there are changes, write them back using our optimized method.
    if (updatesNeeded != TankInfo::TID_NONE) {
        ESP_LOGI(TAG, "Committing changes (flags: 0x%X) to tank 0x%016llX on bus %d", (uint32_t)updatesNeeded, tankInfo.uid, busIndex);
        updateEeprom(currentEepromData, updatesNeeded, busIndex);
    } else {
        ESP_LOGI(TAG, "No changes to commit for tank 0x%016llX", tankInfo.uid);
    }

    xSemaphoreGiveRecursive(_swimuxMutex);
    return true;
}

bool TankManager::refreshTankInfo(TankInfo& tankInfo)
{
    if(_isServoMode) return false;
    // 1. The UID must be provided in the tankInfo struct.
    if (tankInfo.uid == 0) {
        ESP_LOGE(TAG, "refreshTankInfo: UID must be provided.");
        return false;
    }

    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) != pdTRUE) {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex for refreshTankInfo!");
        return false;
    }

    // 2. Find which bus the tank is on. This also refreshes the presence list.
    int8_t busIndex = getBusOfTank(tankInfo.uid);
    if (busIndex < 0) {
        ESP_LOGW(TAG, "refreshTankInfo: Tank with UID 0x%016llX not found.", tankInfo.uid);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    // 3. Read the entire EEPROM data block from the tank.
    TankEEpromData_t eepromData;
    uint8_t* eeData = reinterpret_cast<uint8_t*>(&eepromData);
    if (SMREZ_OK != _swiMux.read(busIndex, eeData, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "refreshTankInfo: Failed to read from tank on bus %d", busIndex);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    // 4. Populate the passed-in TankInfo object with the data from the EEPROM.
    tankInfo.fillFromEeprom(eepromData);
    // fillFromEeprom doesn't set the busIndex, so we must set it manually.
    tankInfo.busIndex = busIndex;

    ESP_LOGI(TAG, "Refreshed info for tank 0x%016llX on bus %d", tankInfo.uid, busIndex);
    xSemaphoreGiveRecursive(_swimuxMutex);
    return true;
}

bool TankManager::updateRemaingKibble(const uint64_t uid, uint16_t newRemainingGrams)
{
    if(_isServoMode) return false;
    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) != pdTRUE) {
        ESP_LOGE(TAG, "Failed to acquire SwiMux mutex for updateRemaingKibble!");
        return false;
    }

    // 1. Find the tank. This also refreshes the presence list.
    int8_t busIndex = getBusOfTank(uid);
    if (busIndex < 0) {
        ESP_LOGE(TAG, "updateRemaingKibble: Tank with UID 0x%016llX not found.", uid);
        xSemaphoreGiveRecursive(_swimuxMutex);
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
        ESP_LOGW(TAG, "updateRemaingKibble: Tank 0x%016llX found on bus but not in cache.", uid);
    }

#ifdef TANK_EEPROM_CRC_IGNORES_REMAININ_GRAMS
    // --- Fast path: direct write, CRC not impacted ---
    const uint8_t offset = offsetof(TankEEpromData_t::_RECORD_, remainingGrams);
    uint8_t* pData       = reinterpret_cast<uint8_t*>(&newRemainingGrams);

    if (SMREZ_OK == _swiMux.write(busIndex, pData, offset, sizeof(TankEEpromData_t::_RECORD_::remainingGrams))
      && SMREZ_OK
        == _swiMux.write(busIndex, pData, offset + sizeof(TankEEpromData_t::_RECORD_), sizeof(TankEEpromData_t::_RECORD_::remainingGrams))) {
        ESP_LOGI(TAG, "Updated remaining kibble (fast path) for tank 0x%016llX to %d g.", uid, newRemainingGrams);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return true;
    }
#else
    // --- Safe path: full read/modify/finalize/write ---
    TankEEpromData_t eedata;
    uint8_t* eeBytes = reinterpret_cast<uint8_t*>(&eedata);

    if (SMREZ_OK != _swiMux.read(busIndex, eeBytes, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "updateRemaingKibble: Failed to read EEPROM of tank 0x%016llX", uid);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    // Update both records
    eedata.records[0].remainingGrams = newRemainingGrams;
    eedata.records[1].remainingGrams = newRemainingGrams;

    // Recompute CRCs + copy active record
    TankEEpromData_t::finalize(eedata, 0);

    if (SMREZ_OK != _swiMux.write(busIndex, eeBytes, 0, sizeof(TankEEpromData_t))) {
        ESP_LOGE(TAG, "updateRemaingKibble: Failed to write EEPROM of tank 0x%016llX", uid);
        xSemaphoreGiveRecursive(_swimuxMutex);
        return false;
    }

    ESP_LOGI(TAG, "Updated remaining kibble (safe path) for tank 0x%016llX to %d g.", uid, newRemainingGrams);
    xSemaphoreGiveRecursive(_swimuxMutex);
    return true;
#endif

    ESP_LOGE(TAG, "Failed to update remaining kibble for tank 0x%016llX", uid);
    xSemaphoreGiveRecursive(_swimuxMutex);
    return false;
}

// --- Servo Control Implementation ---
void TankManager::setServoPower(bool on) {
    if(on && !_isServoMode) {
        _switchToServoMode();
    }
    
    digitalWrite(SERVO_POWER_ENABLE_PIN, on ? LOW : HIGH);
    ESP_LOGI(TAG, "Servo power %s", on ? "ON" : "OFF");

    if(!on && _isServoMode) {
        _switchToSwiMode();
    }
}

void TankManager::setServoPWM(uint8_t servoNum, uint16_t pwm) {
    if (servoNum >= 16) return;
    if (!_isServoMode) _switchToServoMode();
    
    uint16_t ticks = map(pwm, 0, 20000, 0, 4095);
    _pwm.setPWM(servoNum, 0, ticks);
}

void TankManager::setContinuousServo(uint8_t servoNum, float speed) {
    if (!_isServoMode) {
        ESP_LOGW(TAG, "Attempted to set servo speed while not in servo mode. Switching modes.");
        _switchToServoMode();
    }

    if (speed > 1.0) speed = 1.0;
    if (speed < -1.0) speed = -1.0;

    if (abs(speed) < 0.01) {
        setServoPWM(servoNum, SERVO_CONTINUOUS_STOP_PWM);
    } else if (speed > 0) {
        uint16_t pwm = map(speed * 100, 0, 100, SERVO_CONTINUOUS_STOP_PWM, SERVO_CONTINUOUS_FWD_PWM);
        setServoPWM(servoNum, pwm);
    } else {
        uint16_t pwm = map(speed * 100, -100, 0, SERVO_CONTINUOUS_REV_PWM, SERVO_CONTINUOUS_STOP_PWM);
        setServoPWM(servoNum, pwm);
    }
}

void TankManager::stopAllServos() {
    if (!_isServoMode) {
       _switchToServoMode(); // Ensure we can send stop commands
    }
    for (uint8_t i = 0; i < 16; i++) {
        setContinuousServo(i, 0.0);
    }
    setServoPower(false); // This will also switch back to SWI mode
    ESP_LOGW(TAG, "All servos stopped and powered off.");
}

void TankManager::openHopper() {
    setServoPWM(0, _hopperOpenPwm);
}

void TankManager::closeHopper() {
    setServoPWM(0, _hopperClosedPwm);
}


#pragma region Test methods for debug, to be commented out upon release



SwiMuxPresenceReport_t TankManager::testSwiMuxAwaken()
{

    ESP_LOGI(TAG, "Poking SwiMux...\n");
    SwiMuxPresenceReport_t res;
    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

        res = _swiMux.getPresence();
        xSemaphoreGiveRecursive(_swimuxMutex);
        if (res.busesCount > 0) {
            ESP_LOGI(TAG, "SwiMux awakened, %d buses, %d connected, map: 0x%04X", res.busesCount, __builtin_popcount(res.presences), res.presences);
        } else {
            ESP_LOGI(TAG, "Awakening of SwiMux FAILED !");
        }
    } else {
        ESP_LOGE(TAG, "Error: Could not acquire SwiMux mutex for test.");
    }

    return res;
}

bool TankManager::testSwiMuxSleep()
{

    ESP_LOGI(TAG, "Putting SwiMux to sleep.\n");

    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

        bool result = _swiMux.sleep();
        xSemaphoreGiveRecursive(_swimuxMutex);
        ESP_LOGI(TAG, "Putting SwiMux to sleep %s", (result ? "successful." : "FAILED !"));
        return result;
    } else {
        ESP_LOGE(TAG, "Error: Could not acquire SwiMux mutex for test.");
    }

    return false;
}

bool TankManager::testSwiBusUID(uint8_t index, uint64_t& result)
{
    ESP_LOGI(TAG, "Getting UID from bus %d...", index % 6);

    if (xSemaphoreTakeRecursive(_swimuxMutex, MUTEX_ACQUISITION_TIMEOUT) == pdTRUE) {

        bool success = SwiMuxResult_e::SMREZ_OK == _swiMux.getUid(index % 6, result);
        xSemaphoreGiveRecursive(_swimuxMutex);
        ESP_LOGI(TAG, "UID acquisition %s", (success ? "successful." : "FAILED !"));
        return success;
    } else {
        ESP_LOGE(TAG, "Error: Could not acquire SwiMux mutex for test.");
    }

    return false;
}

#pragma endregion
