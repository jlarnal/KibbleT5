#include "SwiMuxSerial.h"
#include "SerialDebugger.hpp"

//#define DEBUG_SWIMUX

static const char* TAG = "SwiMuxSerial";

#if defined(DEBUG_SWIMUX) && defined(ARDUINO)
#include <HardwareSerial.h>
#define SWI_DBGF(fmt, ...)                                                                                                                           \
    do {                                                                                                                                             \
        Serial.printf(fmt, __VA_ARGS__);                                                                                                             \
        Serial.flush();                                                                                                                              \
    } while (0)
#define SWI_DBG(fmt)                                                                                                                                 \
    do {                                                                                                                                             \
        Serial.print(fmt);                                                                                                                           \
    } while (0)
#define SWI_DBGBUFF(TITLE, BUFF, LEN) DebugSerial.print(TITLE, BUFF, LEN)
#else
#define SWI_DBGF(fmt, ...)            _NOP()
#define SWI_DBG(fmt)                  _NOP()
#define SWI_DBGBUFF(TITLE, BUFF, LEN) _NOP()
#endif

const char* SwiMuxResultString(SwiMuxResult_e value)
{
    switch (value) {
        case SMREZ_OK:
            return "SMREZ_OK";
        case SMREZ_FRAME_ERROR:
            return "SMREZ_FRAME_ERROR";
        case SMREZ_INVALID_PAYLOAD:
            return "SMREZ_INVALID_PAYLOAD";
        case SMREZ_BUS_INDEX_OUT_OF_RANGE:
            return "SMREZ_BUS_INDEX_OUT_OF_RANGE";
        case SMREZ_NO_DEVICE:
            return "SMREZ_NO_DEVICE";
        case SMREZ_TIMED_OUT:
            return "SMREZ_TIMED_OUT";
        case SMREZ_READ_RESP_ERROR:
            return "SMREZ_READ_RESP_ERROR";
        case SMREZ_WRITE_OUTOFMEM:
            return "SMREZ_WRITE_OUTOFMEM";
        case SMREZ_WRITE_ENCODE_FAILED:
            return "SMREZ_WRITE_ENCODE_FAILED";
        case SMREZ_WRITE_ACK_MISSING:
            return "SMREZ_WRITE_ACK_MISSING";
        default:
            return "UNDEFINED";
    }
}


static uint64_t u64fromBytes(uint8_t* bytes, size_t len)
{
    uint64_t result = 0; // perfectly aligned
    if (!bytes || len < 8)
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

inline static constexpr bool areNegates(uint8_t a, uint8_t b) noexcept
{
    // cast the promoted result of ~b back to uint8_t to get the 8-bit bitwise NOT
    return a == static_cast<uint8_t>(~b);
}

void SwiMuxSerial_t::begin()
{
    if (!_beginCalled) {
        _sPort.begin(57600, SerialConfig::SERIAL_8N1, _rxPin, _txPin);
        SWI_DBG("Serial port initialized.");
    }
}



bool SwiMuxSerial_t::assertAwake(size_t retries)
{
    uint8_t msg[2] = { SMCMD_Wakeup, (uint8_t)(0xFF & ~SMCMD_Wakeup) };
    _sPort.flush();
    while (_sPort.available()) {
        _sPort.read();
    }

    bool success;
    // Wake up and resync
    _codec.resync([this](uint8_t val) { this->_sPort.write(val); }, [](unsigned long ms) { vTaskDelay(pdMS_TO_TICKS(ms)); }, true);

    do {
        _codec.encode(msg, 2, [this](uint8_t value) { this->_sPort.write(((uint8_t)value)); });
        if (_codec.waitForAckTo(
              SMCMD_Wakeup, millis, [this]() -> int { return this->_sPort.read(); }, [](unsigned long ms) { vTaskDelay(pdMS_TO_TICKS(ms)); })) {
            success = true;
            break;
        } else {
            success = false;
            SWI_DBGF("\r\n--> waitForAckTo(%d) failed, %d retries remaining.\r\n", SMCMD_Wakeup, retries - 1);
        }
    } while (--retries);
    // Wait for any other message to arrive
    vTaskDelay(pdMS_TO_TICKS(20));
    while (_sPort.available()) {
        _sPort.read();
    }

    return success;
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
    if (!assertAwake())
        return false;
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
    if (!assertAwake())
        return SwiMuxPresenceReport_t();
    while (_sPort.available()) {
        _sPort.read();
    }

    _codec.encode(SwiMuxRequest_GetPresence, sizeof(SwiMuxRequest_GetPresence), [this](uint8_t value) { this->_sPort.write(((uint8_t)value)); });

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
    SWI_DBGF("[_pollPresencePacket] entered.%s", "\r\n");
    do {

        int charVal = _sPort.read();

        if (charVal > -1) {
            SWI_DBGF("0x%02x, ", charVal);
            SwiMuxError_e res = _codec.decode((uint8_t)charVal, payload, pLen);
            if (res == SMERR_Done) {
                SWI_DBGF("[pollPresence] payload decoded at %u\r\n", millis());
                if (pLen != 0) {
                    ESP_LOGI(TAG, "_pollPresencePacket: packet decoded, pLen is %d", pLen);
                    SWI_DBGBUFF("(SwiMuxCmdPresence_t):", (void*)payload, pLen);
                }

                if (pLen == sizeof(SwiMuxCmdPresence_t) && payload != nullptr && payload[0] == SMCMD_GetPresence
                  && areNegates(payload[0], payload[1])) {
                    ESP_LOGI(TAG, "_pollPresencePacket: Received payload of %d bytes\r\n", pLen);
                    SwiMuxCmdPresence_t resp;
                    memcpy(&resp, payload, sizeof(SwiMuxCmdPresence_t));
                    result.busesCount = resp.busesCount;
                    result.presences  = (((uint16_t)resp.presenceMSB) << 8) | resp.presenceLSB;
                    return result;
                }
            } else if (res != SMERR_Ok) {
                ESP_LOGW(TAG, "_pollPresencePacket: Failed to retreive presence report (err #%d)", res);
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
    if (!assertAwake())
        return SwiMuxResult_e::SMREZ_SWIMUX_SILENT;

    SwiMuxGetUID_t getUidCmd = SwiMuxGetUID_t((uint8_t)(busIndex % 6));
    _codec.encode((uint8_t*)&getUidCmd, sizeof(getUidCmd), [this](uint8_t value) { this->_sPort.write(((uint8_t)value)); });
    uint8_t* payload = nullptr;
    size_t pLen      = 0;
    //vTaskDelay(pdMS_TO_TICKS(GETUID_CMD_DELAY_MS));
    uint32_t startTime = millis();

    do {
        if (_sPort.available()) {
            int charVal = _sPort.read();

            if (charVal > -1) {
                SWI_DBGF("0x%02X\r\n", charVal);
                SwiMuxError_e res = _codec.decode((uint8_t)charVal, payload, pLen);
                if (res == SMERR_Done) {
                    SWI_DBGF("[getUid] payload decoded at %u\r\n", millis());
                    SWI_DBGBUFF("Payload:", payload, pLen);
                    SWI_DBGF("areNegates: %d\r\n", areNegates(payload[0], payload[1]) ? 1 : 0);
                    if (pLen > 0 && payload != nullptr && payload[0] == SMCMD_HaveUID && areNegates(payload[0], payload[1])) {

                        SWI_DBG("[geUid]\033[93mSUCCESS !!\033[0m\r\n");
                        uid      = u64fromBytes(payload + 2, sizeof(uid));
                        _isAwake = true;
                        return SwiMuxResult_e::SMREZ_OK;
                    }
                } else if (res != SMERR_Ok) {
                    uid = 0;
                    SWI_DBGF("[SwiMuxSerial::getUid] Failed to retreive UID on port %d (err #%d)\r\n", getUidCmd.busIndex, res);
                    return SwiMuxResult_e::SMREZ_FRAME_ERROR;
                }
            }
        }
        vTaskDelay(pdMS_TO_TICKS(2)); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    return SMREZ_TIMED_OUT;
}


SwiMuxResult_e SwiMuxSerial_t::rollCall(RollCallArray_t& uidsList, uint32_t timeout_ms)
{
    if (!assertAwake())
        return SwiMuxResult_e::SMREZ_SWIMUX_SILENT;
    uint8_t msg[8] = { SMCMD_RollCall, (uint8_t)(0xFF & ~SMCMD_RollCall) };
    _codec.encode(msg, 2, [this](uint8_t val) { this->_sPort.write(val); });

    //vTaskDelay(ROLLCALL_CMD_DELAY_MS);
    uint32_t startTime = millis();

    uint8_t* payload = nullptr;

    memset(&uidsList, 0, sizeof(RollCallArray_t));

    size_t pLen = 0;
    do {
        if (_sPort.available()) {
            int charVal = _sPort.read();
            if (charVal > -1) {
                SwiMuxError_e res = _codec.decode((uint8_t)charVal, payload, pLen);
                if (res == SMERR_Done) {
                    SWI_DBGF("[rollCall] payload decoded at %u\r\n", millis());
                    if (pLen == sizeof(SwiMuxRollCallResult_t) && payload != nullptr && payload[0] == SMCMD_RollCall
                      && areNegates(payload[0], payload[1])) { // valid payload ?
                        SWI_DBG("[rollCall] payload validated !\r\n");
                        SWI_DBGBUFF("uids:", &payload[2], pLen - 2);
                        for (int busIndex = 0; busIndex < NUMBER_OF_BUSES; busIndex++) {
                            memcpy((void*)&uidsList.bus[busIndex], (void*)&payload[2 + busIndex * 8], 8);
                        }
                        _isAwake = true;
                        return SMREZ_OK;
                    } else { // We got a paylod, but not the expected one.
                        SWI_DBGF("[rollCall] payload invalid (payLoad=%p, pLen=%d) !\r\n", payload, pLen);
                        SWI_DBGBUFF("contents:", payload, pLen);
                        return SMREZ_INVALID_PAYLOAD;
                    }

                } else if (res != SMERR_Ok) {
                    _isAwake = true;
                    ESP_LOGW(TAG, "Failed to retreive roll call (err #%d)", res);
                    return SMREZ_FRAME_ERROR;
                }
            }
        }
        vTaskDelay(1); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    return SMREZ_TIMED_OUT;
}


SwiMuxResult_e SwiMuxSerial_t::read(uint8_t busIndex, uint8_t* bufferOut, uint8_t offset, uint8_t len, uint32_t timeout_ms)
{
    if (bufferOut == nullptr)
        return SMREZ_NULL_PARAM;
    if (!assertAwake())
        return SwiMuxResult_e::SMREZ_SWIMUX_SILENT;
    // Start by sending the read request.
    SwiMuxCmdRead_t cmd = { .Opcode = SMCMD_ReadBytes,
        .NegOpcode                  = (uint8_t)(0xFF & ~SMCMD_ReadBytes),
        .busIndex                   = (uint8_t)(busIndex % 6),
        .offset                     = offset,
        .length                     = len };
    _codec.encode((uint8_t*)&cmd, sizeof(SwiMuxCmdRead_t), [this](uint8_t val) { this->_sPort.write(val); });

    //vTaskDelay(pdMS_TO_TICKS(SwiMuxSerial_t::READ_CMD_DELAY_MS));
    uint32_t startTime = millis();
    uint8_t* payload   = nullptr;
    size_t pLen        = 0;
    int received;
    do {
        received = _sPort.read();
        if (received > -1) {
            SwiMuxError_e res = _codec.decode(received, payload, pLen);
            if (res == SMERR_Done) {
                SWI_DBGF("[read] payload decoded at %u\r\n", millis());
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
            } else if (res != SMERR_Ok) {
                ESP_LOGW(TAG, "Failed to read device on bus %d (err #%d)", cmd.busIndex, res);
                return SMREZ_FRAME_ERROR;
            }
        }
        vTaskDelay(1); // with a tick of 1ms (as default on ESP32), we should get 5.76 characters per wait cycle @ 57600bds.
    } while ((millis() - startTime) <= timeout_ms);
    return SMREZ_TIMED_OUT;
}


SwiMuxResult_e SwiMuxSerial_t::write(uint8_t busIndex, const uint8_t* bufferIn, uint8_t offset, uint8_t len, uint32_t timeout_ms)
{
    if (bufferIn == nullptr)
        return SMREZ_NULL_PARAM;
    if (!assertAwake())
        return SwiMuxResult_e::SMREZ_SWIMUX_SILENT;
    // Create a write command.
    SwiMuxCmdWrite_t* pCmd = (SwiMuxCmdWrite_t*)heap_caps_malloc(sizeof(SwiMuxCmdWrite_t) + (size_t)len, MALLOC_CAP_32BIT);

    if (pCmd == nullptr) { // allocation failed ?
        ESP_LOGE(
          TAG, "Could not allocate %u bytes in internal ram for `SwiMuxSerial_t::write` command buffer.", sizeof(SwiMuxCmdWrite_t) + (size_t)len);
        return SMREZ_WRITE_OUTOFMEM;
    }

    pCmd->Opcode    = SMCMD_WriteBytes;
    pCmd->NegOpcode = (uint8_t)(0xFF & ~SMCMD_WriteBytes);
    pCmd->busIndex  = (uint8_t)(busIndex % NUMBER_OF_BUSES);
    pCmd->offset    = offset;
    pCmd->length    = len;
    // Copy into pCmd just after the SwiMuxCmdWrite_t header last byte
    memcpy(&pCmd->length + 1, bufferIn, len);

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
    heap_caps_free(pCmd);
    return result;
}
