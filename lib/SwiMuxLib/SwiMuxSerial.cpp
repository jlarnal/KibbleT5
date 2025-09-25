#include "SwiMuxSerial.h"

static const char* TAG = "SwiMuxSerial";

static uint64_t u64fromBytes(uint8_t* bytes, size_t len)
{
    uint64_t result = 0; // perfectly aligned
    if (!bytes)
        return 0;
    if (len > 8)
        len = 8; /* clamp to 8 bytes max */

/* Compile-time endianness detection (common predefined macros) */
#if (defined(__BYTE_ORDER__) && (__BYTE_ORDER__ == __ORDER_LITTLE_ENDIAN__)) || defined(__LITTLE_ENDIAN__) || defined(_WIN32) || defined(__ARMEL__)  \
  || defined(__MIPSEL__)
#define U64FROMBYTES_LITTLE_ENDIAN 1
#elif (defined(__BYTE_ORDER__) && (__BYTE_ORDER__ == __ORDER_BIG_ENDIAN__)) || defined(__BIG_ENDIAN__) || defined(__ARMEB__) || defined(__MIPSEB__)
    /* big endian — leave macro unset */
#else
#error "Unable to detect endianness for u64fromBytes"
#endif

#ifdef U64FROMBYTES_LITTLE_ENDIAN
    // Little endian
    uint8_t* dest = (uint8_t*)&result;
    while (len--) {
        *dest++ = *bytes++;
    }
#else
    // Big endian
    uint8_t* dest = &(((uint8_t*)&result)[7]);
    while (len--) {
        *dest-- = *bytes++;
    }
#endif

    return result;
}


void SwiMuxSerial_t::begin()
{
    if (!_beginCalled) {
        _sPort.begin(57600, SerialConfig::SERIAL_8N1, _rxPin, _txPin);
        ESP_LOGI(TAG, "Serial port initialized.");
    }
}

bool SwiMuxSerial_t::sleep()
{
    _codec.encode(SwiMuxRequest_Sleep, sizeof(SwiMuxRequest_Sleep), [this](uint8_t value) { this->_sPort.write(((uint8_t)value)); });
    _isAwake = false;
    return _codec.waitForAckTo(
      SwiMuxOpcodes_e::SMCMD_Sleep, millis, [this]() -> int { return this->_sPort.read(); }, [](unsigned long ms) { vTaskDelay(pdMS_TO_TICKS(ms)); });
}

bool SwiMuxSerial_t::hasEvents(SwiMuxPresenceReport_t* reportOut)
{
    SwiMuxPresenceReport_t report;
    report = _pollPresencePacket();
    if (report.busesCount > 0) {
        if (reportOut != NULL)
            *reportOut = report;
        return true;
    }
    return false;
}

SwiMuxPresenceReport_t SwiMuxSerial_t::getPresence(uint32_t timeout_ms)
{
    while (_sPort.available()) {
        _sPort.read();
    }

    _codec.encode(SwiMuxRequest_GetPresence, sizeof(SwiMuxRequest_GetPresence), [this](uint8_t value) { this->_sPort.write(((uint8_t)value)); });
    vTaskDelay(pdMS_TO_TICKS(PRESENCE_DELAY_MS));
    SwiMuxPresenceReport_t res = _pollPresencePacket(timeout_ms);
    if (res.busesCount > 0)
        _isAwake = true;
    return res;
}

SwiMuxPresenceReport_t SwiMuxSerial_t::_pollPresencePacket(uint32_t timeout_ms)
{
    uint8_t* payload              = nullptr;
    size_t pLen                   = 0;
    uint32_t startTime            = millis();
    SwiMuxPresenceReport_t result = { 0, 0 };
    do {
        if (_sPort.available()) {
            int charVal = _sPort.read();
            if (charVal > -1) {
                _codec.decode((uint8_t)charVal, payload, pLen);
            }
            if (pLen == sizeof(SwiMuxCmdPresence_t) && payload != nullptr && (payload[0] ^ payload[1]) == 0) {
                SwiMuxCmdPresence_t resp;
                memcpy(&resp, payload, sizeof(SwiMuxCmdPresence_t));
                result.busesCount = resp.busesCount;
                result.presences  = (((uint16_t)resp.presenceMSB) << 8) | resp.presenceLSB;
                return result;
            }
        }
        vTaskDelay(1); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    if (result.busesCount > 0)
        _isAwake = true;
    return result;
}


SwiMuxResult_e SwiMuxSerial_t::getUid(uint8_t busIndex, uint64_t& uid, uint32_t timeout_ms)
{
    SwiMuxGetUID_t getUidCmd = SwiMuxGetUID_t((uint8_t)(busIndex % 6));
    _codec.encode((uint8_t*)&getUidCmd, sizeof(getUidCmd), [this](uint8_t value) { this->_sPort.write(((uint8_t)value)); });
    uint8_t* payload = nullptr;
    size_t pLen      = 0;
    vTaskDelay(pdMS_TO_TICKS(GETUID_CMD_DELAY_MS));
    uint32_t startTime = millis();
    do {
        if (_sPort.available()) {
            int charVal = _sPort.read();
            if (charVal > -1)
                _codec.decode((uint8_t)charVal, payload, pLen);
            if (pLen > 0 && payload != nullptr) {
                uid      = u64fromBytes(payload, pLen);
                _isAwake = true;
                return SwiMuxResult_e::SMREZ_OK;
            }
        }
        vTaskDelay(1); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    return SMREZ_TIMED_OUT;
}


SwiMuxResult_e SwiMuxSerial_t::rollCall(RollCallArray_t& uidsList, uint32_t timeout_ms)
{
    uint8_t msg[8] = { SMCMD_RollCall, (uint8_t)(0xFF & ~SMCMD_RollCall) };
    _codec.encode(msg, 2, [this](uint8_t val) { this->_sPort.write(val); });

    vTaskDelay(ROLLCALL_CMD_DELAY_MS);
    uint32_t startTime = millis();

    uint8_t* payload = nullptr;

    size_t pLen = 0;
    do {
        if (_sPort.available()) {
            int charVal = _sPort.read();
            if (charVal > -1) {
                if (false == _codec.decode((uint8_t)charVal, payload, pLen)) {
                    _isAwake = true;
                    return SMREZ_FRAME_ERROR;
                }
                if (pLen == sizeof(SwiMuxRollCallResult_t) && payload != nullptr) {
                    if (payload[0] == SMCMD_RollCall && payload[1] != (uint8_t)(0xFF & ~SMCMD_RollCall)) { // valid payload ?
                        memcpy((void*)&uidsList.bus[0], &payload[2 + 0 * 8], 8);
                        memcpy((void*)&uidsList.bus[1], &payload[2 + 1 * 8], 8);
                        memcpy((void*)&uidsList.bus[2], &payload[2 + 2 * 8], 8);
                        memcpy((void*)&uidsList.bus[3], &payload[2 + 3 * 8], 8);
                        memcpy((void*)&uidsList.bus[4], &payload[2 + 4 * 8], 8);
                        memcpy((void*)&uidsList.bus[5], &payload[2 + 5 * 8], 8);
                        _isAwake = true;
                        return SMREZ_OK;
                    } else { // We got a paylod, but not the expected one.
                        return SMREZ_INVALID_PAYLOAD;
                    }
                }
            }
        }
        vTaskDelay(1); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    return SMREZ_TIMED_OUT;
}


SwiMuxResult_e SwiMuxSerial_t::read(uint8_t busIndex, uint8_t*& bufferOut, uint8_t offset, uint8_t len, uint32_t timeout_ms)
{
    // Start by sending the read request.
    SwiMuxCmdRead_t cmd = { .Opcode = SMCMD_ReadBytes,
        .NegOpcode                  = (uint8_t)(0xFF & ~SMCMD_ReadBytes),
        .busIndex                   = (uint8_t)(busIndex % 6),
        .offset                     = offset,
        .length                     = len };
    _codec.encode((uint8_t*)&cmd, sizeof(SwiMuxCmdRead_t), [this](uint8_t val) { this->_sPort.write(val); });

    vTaskDelay(pdMS_TO_TICKS(SwiMuxSerial_t::READ_CMD_DELAY_MS));
    uint32_t startTime = millis();
    uint8_t* payload   = nullptr;
    size_t pLen        = 0;
    int received;
    do {
        received = _sPort.read();
        if (received > -1) {
            _codec.decode(received, payload, pLen);
            if (pLen < (len + sizeof(SwiMuxCmdRead_t)) && payload != nullptr) {
                // Check and copy the payload.0
                if (payload[0] != (uint8_t)SMCMD_ReadBytes || payload[1] != (0xFF & ~SMCMD_ReadBytes) || payload[2] != cmd.busIndex
                  || payload[3] != cmd.offset) {
                    // Payload has some unexpected header.
                    ESP_LOGE(TAG, "Unexpected values in read response header.");
                    _isAwake = true;
                    return SMREZ_READ_RESP_ERROR;
                } else { // payload seems legit
                    memcpy(bufferOut, &payload[sizeof(SwiMuxCmdRead_t)], payload[4]);
                    _isAwake = true;
                    return SMREZ_OK;
                }
            }
        }
        vTaskDelay(1); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    return SMREZ_TIMED_OUT;
}


SwiMuxResult_e SwiMuxSerial_t::write(uint8_t busIndex, uint8_t*& bufferIn, uint8_t offset, uint8_t len, uint32_t timeout_ms)
{
    // Create a write command.
    SwiMuxCmdWrite_t* pCmd = (SwiMuxCmdWrite_t*)heap_caps_aligned_alloc(4, sizeof(SwiMuxCmdWrite_t) + (size_t)len, MALLOC_CAP_INTERNAL);

    if (pCmd == nullptr) { // allocation failed ?
        ESP_LOGE(
          TAG, "Could not allocate %u bytes in internal ram for `SwiMuxSerial_t::write` command buffer.", sizeof(SwiMuxCmdWrite_t) + (size_t)len);
        return SMREZ_WRITE_OUTOFMEM;
    }

    pCmd->Opcode    = SMCMD_WriteBytes;
    pCmd->NegOpcode = (uint8_t)(0xFF & ~SMCMD_WriteBytes);
    pCmd->busIndex  = (uint8_t)(busIndex % 6);
    pCmd->offset    = offset;
    pCmd->length    = len;
    // Copy into pCmd just after the SwiMuxCmdWrite_t header last byte
    memcpy((void*)&((uint8_t*)(void*)pCmd)[sizeof(SwiMuxCmdWrite_t)], bufferIn, len);

    SwiMuxResult_e result = SMREZ_WRITE_ENCODE_FAILED;
    if (_codec.encode((const uint8_t*)(void*)pCmd, sizeof(SwiMuxCmdWrite_t) + (size_t)len, [this](uint8_t wrtVal) { this->_sPort.write(wrtVal); })) {
        if (_codec.waitForAckTo(
              SMCMD_WriteBytes, millis, [this]() -> int { return this->_sPort.read(); }, [](unsigned long wms) { vTaskDelay(pdMS_TO_TICKS(wms)); })) {
            _isAwake = true;
            result   = SMREZ_OK;
        } else {
            result = SMREZ_TIMED_OUT;
        }
    }
    return result;
}
