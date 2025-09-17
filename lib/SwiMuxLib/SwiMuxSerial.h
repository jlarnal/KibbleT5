#ifndef H_SWIMUX_SERIAL_H
#define H_SWIMUX_SERIAL_H

#include <HardwareSerial.h>
#include <SwiMuxComms.hpp>

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
};



class SwiMuxSerial_t {
  public:
    SwiMuxSerial_t(HardwareSerial& serial, uint8_t txPin, uint8_t rxPin) : _codec(), _sPort(serial), _isAwake(false), _txPin(txPin), _rxPin(rxPin) {}

    void begin();

    bool sleep();
    bool isAwake();
    SwiMuxResult_e rollCall(RollCallArray_t& uids, uint32_t timeout_ms = ROLLCALL_TIMEOUT_MS);
    SwiMuxResult_e read(uint8_t busIndex, uint8_t*& bufferOut, uint8_t offset, uint8_t len, uint32_t timeout_ms = READ_TIMEOUT_MS);
    SwiMuxResult_e write(uint8_t busIndex, uint8_t*& bufferIn, uint8_t offset, uint8_t len, uint32_t timeout_ms = WRITE_TIMEOUT_MS);
    SwiMuxResult_e getUid(uint8_t busIndex, uint64_t& result, uint32_t timeout_ms = GETUID_TIMEOUT_MS);

  private:
    static constexpr uint32_t GETUID_CMD_DELAY_MS   = 3;
    static constexpr uint32_t GETUID_TIMEOUT_MS     = 100;
    static constexpr uint32_t READ_CMD_DELAY_MS     = 4;
    static constexpr uint32_t READ_TIMEOUT_MS       = 100;
    static constexpr uint32_t WRITE_CMD_DELAY_MS    = 8;
    static constexpr uint32_t WRITE_TIMEOUT_MS      = 100;
    static constexpr uint32_t ROLLCALL_CMD_DELAY_MS = 20;
    static constexpr uint32_t ROLLCALL_TIMEOUT_MS   = 100;

    SwiMuxComms_t _codec;
    HardwareSerial _sPort;
    bool _isAwake;
    uint8_t _rxPin, _txPin;
};

#endif
