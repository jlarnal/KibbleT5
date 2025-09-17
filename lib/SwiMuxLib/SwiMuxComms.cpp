#include "SwiMuxComms.hpp"



// CRC32 (reflected poly 0xEDB88320), bitwise, small-footprint
static inline uint32_t crc32_init(void)
{
    return 0xFFFFFFFFu;
}

static inline uint32_t crc32_update(uint32_t crc, uint8_t data)
{
    crc ^= (uint32_t)data;
    for (int i = 0; i < 8; ++i) {
        if (crc & 1u)
            crc = (crc >> 1) ^ 0xEDB88320u;
        else
            crc >>= 1;
    }
    return crc;
}

static inline uint32_t crc32_finalize(uint32_t crc)
{
    return crc ^ 0xFFFFFFFFu;
}



/**  @brief Sends a error packet. */
void SwiMuxComms_t::sendNack(SwiMuxError_e error, void (&writer)(uint8_t))
{
    uint8_t msg[3] = { SMCMD_Nack, (uint8_t)(0xFF & ~SMCMD_Nack), error };
    encode(msg, 3, writer);
}

/**  @brief Sends an acknowledgement packet. */
void SwiMuxComms_t::sendAck(SwiMuxOpcodes_e opcode, void (&writer)(uint8_t))
{
    uint8_t msg[3] = { SMCMD_Ack, (uint8_t)(0xFF & ~SMCMD_Ack), opcode };
    encode(msg, 3, writer);
}

/**  @brief Sends an acknowledgement packet. */
void SwiMuxComms_t::sendAckArgs(SwiMuxOpcodes_e opcode, uint8_t arg, void (&writer)(uint8_t))
{
    uint8_t msg[4] = { SMCMD_Ack, (uint8_t)(0xFF & ~SMCMD_Ack), opcode, arg };
    encode(msg, 4, writer);
}

void SwiMuxComms_t::sendUid(SwiMuxRespUID_t& uidResp, void (&writer)(uint8_t))
{
    uidResp.Opcode    = SMCMD_HaveUID;
    uidResp.NegOpcode = ~SMCMD_HaveUID;
    encode((uint8_t*)&uidResp, sizeof(SwiMuxRespUID_t), writer);
}


bool SwiMuxComms_t::waitForAckTo(const SwiMuxOpcodes_e opCode, const std::function<unsigned long()>& getTime_ms,
  const std::function<int(void)>& readFunc, std::function<void(unsigned long)> delay_ms_func)
{
    uint32_t timeout_ms = 0;
    switch (opCode) {
        case SwiMuxOpcodes_e::SMCMD_IsAwake:
            [[fallthrough]];
        case SwiMuxOpcodes_e::SMCMD_Sleep:
            timeout_ms = 10;
            break;
        default:
            timeout_ms = 100;
            break;
    }

    uint32_t startTime = getTime_ms();
    uint8_t* payload   = nullptr;
    size_t pLen        = 0;
    int val;

    do {
        val = readFunc();
        if (val > -1) {
            decode((uint8_t)val, payload, pLen);
            if (pLen && payload != nullptr) { // frame ?
                // We had our response frame, let's check its contents.
                if (pLen >= 3 && payload[0] == (uint8_t)SwiMuxOpcodes_e::SMCMD_Ack && payload[1] == ((uint8_t)0xFF & ~SMCMD_Ack)
                  && payload[2] == (uint8_t)opCode) {
                    return true; // opCode was acknowledged ! Yay
                } else {
                    return false; // error in the frame.
                }
            }
            // Haxe some time to receive other bytes.
            if (delay_ms_func != nullptr) {
                delay_ms_func(1);
            }
        }
    } while ((getTime_ms() - startTime) <= timeout_ms);
    return false;
}

/**
 * @brief COBS-encode input||CRC32 and write result using resultWriter callback.
 *
 * @param input pointer to payload bytes
 * @param len payload length (must be <= SWIMUX_BUFF_SIZE per your constraint)
 * @param resultWriter reference to a function that writes one encoded byte (signed char)
 * @return true on success, false on invalid input (len too large)
 */
bool SwiMuxComms_t::encode(const uint8_t* input, size_t len, const std::function<void(const uint8_t)>& resultWriter)
{
    // enforce your stated maximum frame size (payload <= SWIMUX_BUFF_SIZE). Reject otherwise.
    if (len > SWIMUX_BUFF_SIZE)
        return false;

    // compute CRC32 over payload
    uint32_t crc = crc32_init();
    for (size_t i = 0; i < len; ++i)
        crc = crc32_update(crc, input[i]);
    uint32_t final_crc = crc32_finalize(crc);

    // CRC bytes (big-endian)
    uint8_t crc_bytes[4];
    crc_bytes[0] = (uint8_t)((final_crc >> 24) & 0xFFu);
    crc_bytes[1] = (uint8_t)((final_crc >> 16) & 0xFFu);
    crc_bytes[2] = (uint8_t)((final_crc >> 8) & 0xFFu);
    crc_bytes[3] = (uint8_t)(final_crc & 0xFFu);

    // total logical length of stream to encode = payload + 4 CRC bytes
    const size_t total_len = len + 4;

    // helper to read the k-th byte of the logical stream:
    // - if k < len -> input[k]
    // - else -> crc_bytes[k - len]
    auto getByteAt = [&](size_t k) -> uint8_t { return (k < len) ? input[k] : crc_bytes[k - len]; };

    // COBS encoding main loop:
    // at pos 'i' we have to find block_len = number of consecutive non-zero bytes
    // starting at i, but not more than 254 bytes (per COBS) to allow code==0xFF.
    size_t i = 0;
    while (i < total_len) {
        // find block_len
        size_t j = i;
        // scan up to SWIMUX_BUFF_SIZE bytes or until a zero encountered
        const size_t maxBlockData = SWIMUX_BUFF_SIZE + 4; // maximum number of data bytes in a block
        while (j < total_len && (j - i) < maxBlockData && getByteAt(j) != 0) {
            ++j;
        }
        size_t block_len = j - i; // number of non-zero bytes to emit
        uint8_t code     = (uint8_t)(block_len + 1u); // code byte to emit

        // write code byte
        resultWriter(static_cast<char>(code));

        // write block data bytes (if any) directly from input/crc_bytes
        for (size_t k = i; k < i + block_len; ++k) {
            resultWriter(static_cast<char>(getByteAt(k)));
        }

        // advance i:
        // - if we stopped because of an encountered zero (j < total_len && getByteAt(j) == 0),
        //   skip that zero (i = j + 1)
        // - else (we stopped due to hitting maxBlockData or reaching end), set i = j
        if (j < total_len && getByteAt(j) == 0) {
            i = j + 1; // skip the zero; it's represented by code<0xFF
        } else {
            i = j; // either end reached or block was exactly maxBlockData (code==0xFF)
        }
    }

    // final frame delimiter
    resultWriter(static_cast<char>(0x00));

    return true;
}



bool SwiMuxComms_t::decode(const uint8_t byte, uint8_t*& payload, size_t& payloadLength)
{
    payload       = nullptr;
    payloadLength = 0;

    // waiting for first code byte
    if (!inFrame) {
        if (byte == 0)
            return true; // still waiting for start
        inFrame = true;
        code    = byte;
        block   = code - 1;
        _buffer.clear();
        return true;
    }

    // inside a block expecting 'block' raw bytes
    if (block > 0) {
        if (!_buffer.append(byte)) {
            reset();
            return false;
        }
        --block;
        return true;
    }

    // block == 0: byte is either the next code, or 0 => end of frame
    if (byte == 0) {
        // end-of-frame: buffer contains decoded bytes = payload || CRC(4)
        size_t total = _buffer.count();
        if (total < 4) {
            reset();
            return false;
        } // not enough data for CRC

        size_t dataLen = total - 4;

        // compute CRC32 over the payload bytes
        uint32_t crc = crc32_init();
        for (size_t i = 0; i < dataLen; ++i)
            crc = crc32_update(crc, _buffer[i]);
        uint32_t computed = crc32_finalize(crc);

        // reconstruct appended CRC (big-endian)
        uint32_t appended = ((uint32_t)_buffer[dataLen] << 24) | ((uint32_t)_buffer[dataLen + 1] << 16) | ((uint32_t)_buffer[dataLen + 2] << 8)
          | ((uint32_t)_buffer[dataLen + 3]);

        if (computed == appended) {
            payload       = (uint8_t*)_buffer;
            payloadLength = dataLen;
            reset();
            return true;
        } else {
            reset();
            return false;
        }
    } else {
        // new code byte
        code  = byte;
        block = code - 1;
        if (code < 0xFF) {
            // implicit zero between blocks
            if (!_buffer.append(0)) {
                reset();
                return false;
            }
        }
        return true;
    }
}
