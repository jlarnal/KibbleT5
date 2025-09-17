#ifndef H_INTERPRETER_H
#define H_INTERPRETER_H


#include <stdint.h>
#include <stddef.h>
#include <functional>
#include "StaticBuffer.hpp"


enum SwiMuxOpcodes_e : uint8_t
{
    SMCMD_ZERO       = 0,
    SMCMD_ReadBytes  = 1,
    SMCMD_WriteBytes = 2,
    SMCMD_GetUID     = 3,
    SMCMD_RollCall   = 4,
    SMCMD_HaveUID    = 0x73,
    SMCMD_Sleep      = 0xF6,
    SMCMD_IsAwake    = 0xF9,
    SMCMD_Ack        = 0xE1,
    SMCMD_Nack       = 0xE5,
};

enum SwiMuxError_e : uint8_t
{
    SMERR_None          = 0,
    SMERR_UnkownCommand = 0xC0,
    SMERR_Framing,
    SMERR_ReadBytesParams,
    SMERR_BusIndexOutOfRange,
    SMERR_MemOffsetOutOfRange,
    SMERR_ReadLengthOutOfRange,
    SMERR_ReadMemoryFailed,
    SMERR_ReadEncodingRefused,
    SMERR_WriteLengthOutOfRange,
    SMERR_WriteFailed,
    SMERR_GuidUnreadable,
};

struct __attribute__((packed)) SwiMuxCmdRead_t {
    const SwiMuxOpcodes_e Opcode;
    const uint8_t NegOpcode;
    const uint8_t busIndex;
    const uint8_t offset;
    const uint8_t length;
};


struct __attribute__((packed)) SwiMuxCmdWrite_t {
    SwiMuxOpcodes_e Opcode;
    uint8_t NegOpcode;
    uint8_t busIndex;
    uint8_t offset;
    uint8_t length;
};

struct __attribute__((packed)) SwiMuxGetUID_t {
    const SwiMuxOpcodes_e Opcode;
    const uint8_t NegOpcode;
    const uint8_t busIndex;
    SwiMuxGetUID_t() : Opcode(SwiMuxOpcodes_e::SMCMD_GetUID), NegOpcode(0xFF & (~(uint8_t)SwiMuxOpcodes_e::SMCMD_GetUID)), busIndex(0) {}
    SwiMuxGetUID_t(uint8_t busIndex)
        : Opcode(SwiMuxOpcodes_e::SMCMD_GetUID), NegOpcode(0xFF & (~(uint8_t)SwiMuxOpcodes_e::SMCMD_GetUID)), busIndex(busIndex)
    {}
};

struct __attribute__((packed)) SwiMuxRespUID_t {
    SwiMuxOpcodes_e Opcode;
    uint8_t NegOpcode;
    uint8_t uid[8];
    SwiMuxRespUID_t() : Opcode(SMCMD_ZERO), NegOpcode(0) {}
};

struct __attribute__((packed)) SwiMuxRollCallResult_t {
    SwiMuxOpcodes_e Opcode;
    uint8_t NegOpCode;
    uint64_t orderedUids[6 * 8]; // Six uint64 values, some may be all zeros (absent)
};

struct RollCallArray_t {
    uint64_t bus[6];
};

const uint8_t SwiMuxRequest_IsAwake[2] = { SMCMD_IsAwake, (uint8_t)(0xFF & ~SMCMD_IsAwake) };
const uint8_t SwiMuxRequest_Sleep[2]   = { SMCMD_Sleep, (uint8_t)(0xFF & ~SMCMD_Sleep) };

class SwiMuxComms_t {
  public:
    SwiMuxComms_t() : code(0), block(0), inFrame(false) {}

    bool encode(const uint8_t* input, size_t len, const std::function<void(const uint8_t)>& resultWriter);


    /** @brief Decodes a received byte. 
     * @param[in] byte A new byte to decode from the incoming stream. 
     * @param[out] payload If the method returns DECODE_OK, this reference to a pointer is set to the first byte of the payload. In any other case, the method sets it to null. 
     * @param[out] payloadLength If the method returns DECODE_OK, this reference to a size_t is set to the length of the payload pointed by @p payload. In any other case, the method sets it 0 (zero). 
     * @return true as long as the decoding doesn't encounter a frame error, false otherwise */
    bool decode(const uint8_t byte, uint8_t*& payload, size_t& payloadLength);

    bool waitForAckTo(const SwiMuxOpcodes_e opCode, const std::function<unsigned long()>& getTime_ms, const std::function<int(void)>& readFunc,
      std::function<void(unsigned long)> delay_ms_func = nullptr);

    inline void reset()
    {
        inFrame = false;
        code    = 0;
        block   = 0;
        _buffer.clear();
    }

    void sendUid(SwiMuxRespUID_t& uidResp, void (&writer)(uint8_t));
    void sendNack(SwiMuxError_e error, void (&writer)(uint8_t));
    void sendAck(SwiMuxOpcodes_e opcode, void (&writer)(uint8_t));
    void sendAckArgs(SwiMuxOpcodes_e opcode, uint8_t arg, void (&writer)(uint8_t));

  private:
    static constexpr size_t SWIMUX_BUFF_SIZE = 140;
    StaticBuffer_t<SWIMUX_BUFF_SIZE> _buffer;
    uint8_t code; // current code value
    uint8_t block; // remaining bytes in block
    bool inFrame;
};



#endif //!H_INTERPRETER_H
