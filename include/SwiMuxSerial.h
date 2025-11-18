#ifndef H_SWIMUX_SERIAL_H
#define H_SWIMUX_SERIAL_H

#include <HardwareSerial.h>
#include "SwiMuxComms.hpp"

enum SwiMuxResult_e
{
    SMREZ_OK = 0,
    SMREZ_FRAME_ERROR,
    SMREZ_INVALID_PAYLOAD,
    SMREZ_BUS_INDEX_OUT_OF_RANGE,
    SMREZ_NO_DEVICE,
    SMREZ_TIMED_OUT,
    SMREZ_READ_RESP_ERROR,
    SMREZ_WRITE_OUTOFMEM,
    SMREZ_WRITE_ENCODE_FAILED,
    SMREZ_WRITE_ACK_MISSING,
    SMREZ_SWIMUX_SILENT,
    SMREZ_NULL_PARAM,
};

const char* SwiMuxResultString(SwiMuxResult_e value);

struct SwiMuxPresenceReport_t {
    uint16_t presences;
    uint8_t busesCount;

    SwiMuxPresenceReport_t() : presences(0), busesCount(0) {}
    SwiMuxPresenceReport_t(uint16_t presenceMap, uint8_t maxDevices) : presences(presenceMap), busesCount(maxDevices) {}

    bool operator==(const SwiMuxPresenceReport_t& other) { return busesCount == other.busesCount && presences == other.presences; }
    bool operator!=(const SwiMuxPresenceReport_t& other) { return busesCount != other.busesCount || presences != other.presences; }
    SwiMuxPresenceReport_t operator^(const SwiMuxPresenceReport_t& other)
    {
        SwiMuxPresenceReport_t rpt = { (uint16_t)(presences ^ other.presences), 0 };
        rpt.busesCount             = (uint8_t)__builtin_popcount((unsigned int)rpt.presences);
        return rpt;
    }
    SwiMuxPresenceReport_t& operator^=(const SwiMuxPresenceReport_t& other)
    {
        presences ^= other.presences;
        busesCount = (uint8_t)__builtin_popcount((unsigned int)presences);
        return *this;
    }
};

class SwiMuxSerial_t {
  public:
    SwiMuxSerial_t(HardwareSerial& serial, uint8_t txPin, uint8_t rxPin)
        : _codec(), _sPort(serial), _isAwake(false), _beginCalled(false), _txPin(txPin), _rxPin(rxPin)
    {}

    void begin();

    bool sleep();
    bool isAsleep() { return !_isAwake; }
    /**
     * @brief Uses a polling mechanism to detect if the SwiMux interface has produced a wake-up packet.
     * @param[out] reportOut <optional> A report to fill with the possible wake-up packet's presence report contents.
     * @return <false> if no wake-up event has been detected. 
     */
    bool hasEvents(SwiMuxPresenceReport_t* reportOut = NULL);
    SwiMuxPresenceReport_t getPresence(uint32_t timeout_ms = PRESENCE_TIMEOUT_MS);
    SwiMuxResult_e rollCall(RollCallArray_t& uids, uint32_t timeout_ms = ROLLCALL_TIMEOUT_MS);
    SwiMuxResult_e read(uint8_t busIndex, uint8_t* bufferOut, uint8_t offset, uint8_t len, uint32_t timeout_ms = READ_TIMEOUT_MS);
    SwiMuxResult_e write(uint8_t busIndex, const uint8_t* bufferIn, uint8_t offset, uint8_t len, uint32_t timeout_ms = WRITE_TIMEOUT_MS);
    SwiMuxResult_e getUid(uint8_t busIndex, uint64_t& result, uint32_t timeout_ms = GETUID_TIMEOUT_MS);


#ifdef KIBBLET5_DEBUG_ENABLED
    inline void printRawString(const char* str) { _sPort.print(str); }
    inline HardwareSerial& getSerialPort() { return _sPort; }

#endif

    static constexpr uint32_t DEFAULT_SERIAL_CONFIG = SERIAL_8N1;
    static constexpr uint32_t DEFAULT_SERIAL_BAUDS  = 57600;

  private:
#define UART_DURATION_MS_ROUND(CHAR_COUNT, BAUDS) ((((uint64_t)(CHAR_COUNT * 2) * 10000ULL + ((uint64_t)(BAUDS) / 2ULL)) / (uint64_t)(BAUDS)))
    //static constexpr uint32_t PRESENCE_DELAY_MS     = 3;
    //static constexpr uint32_t GETUID_CMD_DELAY_MS   = 3;
    //static constexpr uint32_t READ_CMD_DELAY_MS     = 4;
    //static constexpr uint32_t WRITE_CMD_DELAY_MS    = 8;
    //static constexpr uint32_t ROLLCALL_CMD_DELAY_MS = 20;
    static constexpr size_t AWAKE_RETRIES_DEFAULT = 3;
    static constexpr uint32_t PRESENCE_TIMEOUT_MS = 1 + 2 * UART_DURATION_MS_ROUND(sizeof(SwiMuxPresenceReport_t), DEFAULT_SERIAL_BAUDS);
    static constexpr uint32_t GETUID_TIMEOUT_MS   = 100; //(uint32_t)(10 + 5.0 * UART_DURATION_MS_ROUND(10, DEFAULT_SERIAL_BAUDS));
    static constexpr uint32_t READ_TIMEOUT_MS     = 600; //(uint32_t)(10 + 5.0 * UART_DURATION_MS_ROUND(140, DEFAULT_SERIAL_BAUDS));
    static constexpr uint32_t WRITE_TIMEOUT_MS    = 600; //(uint32_t)(10 + 5.0 * UART_DURATION_MS_ROUND(140, DEFAULT_SERIAL_BAUDS));
    static constexpr uint32_t ROLLCALL_TIMEOUT_MS
      = 333; //(uint32_t)(10 + 5.0 * UART_DURATION_MS_ROUND(sizeof(SwiMuxRespUID_t), DEFAULT_SERIAL_BAUDS));

    bool assertAwake(size_t retries = AWAKE_RETRIES_DEFAULT);
    SwiMuxPresenceReport_t _pollPresencePacket(uint32_t timeout_ms = PRESENCE_TIMEOUT_MS);
    bool pollAck(SwiMuxOpcodes_e opcode, uint32_t timeout_ms = 15);
    SwiMuxComms_t _codec;
    HardwareSerial _sPort;
    volatile bool _isAwake, _beginCalled;
    uint8_t _rxPin, _txPin;
    uint16_t lastPresence();
};

#endif
