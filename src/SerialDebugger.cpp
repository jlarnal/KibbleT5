#include "SerialDebugger.hpp"
#include <functional>

SerialDebugger_t DebugSerial(Serial);

static const char* const CONTROL_CHARS_TABLE[] {
    "<NUL>",
    "<SOH>",
    "<STX>",
    "<ETX>",
    "<EOT>",
    "<ENQ>",
    "<ACK>",
    "<BEL>",
    "<BS>",
    "<HT>",
    "<LF>",
    "<VT>",
    "<FF>",
    "<CR>",
    "<SO>",
    "<SI>",
    "<DLE>",
    "<DC1>",
    "<DC2>",
    "<DC3>",
    "<DC4>",
    "<NAK>",
    "<SYN>",
    "<ETB>",
    "<CAN>",
    "<EM>",
    "<SUB>",
    "<ESC>",
    "<FS>",
    "<GS>",
    "<RS>",
    "<US>",
};

static const char* EXTENDED_CHARS_TABLE[] = {
    "€",
    "0x81",
    u8"‚",
    "ƒ",
    "„",
    "…",
    "†",
    "‡",
    "ˆ",
    "‰",
    "Š",
    "‹",
    "Œ",
    "0x8D",
    "Ž",
    "0x8F",
    "0x90",
    "‘",
    "’",
    "“",
    "”",
    "•",
    "–",
    "—",
    "˜",
    "™",
    "š",
    "›",
    "œ",
    "ž",
    "Ÿ",
    "<NBSP>",
    "¡",
    "¢",
    "£",
    "¤",
    "¥",
    "¦",
    "§",
    "¨",
    "©",
    "ª",
    "«",
    "¬",
    "<SHY>",
    "®",
    "¯",
    "°",
    "±",
    "²",
    "³",
    "´",
    "µ",
    "¶",
    "·",
    "¸",
    "¹",
    "º",
    "»",
    "¼",
    "½",
    "¾",
    "¿",
    "À",
    "Á",
    "Â",
    "Ã",
    "Ä",
    "Å",
    "Æ",
    "Ç",
    "È",
    "É",
    "Ê",
    "Ë",
    "Ì",
    "Í",
    "Î",
    "Ï",
    "Ð",
    "Ñ",
    "Ò",
    "Ó",
    "Ô",
    "Õ",
    "Ö",
    u8"×",
    "Ø",
    "Ù",
    "Ú",
    "Û",
    "Ü",
    "Ý",
    "Þ",
    "ß",
    "à",
    "á",
    "â",
    "ã",
    "ä",
    "å",
    "æ",
    "ç",
    "è",
    "é",
    "ê",
    "ë",
    "ì",
    "í",
    "î",
    "ï",
    "ð",
    "ñ",
    "ò",
    "ó",
    "ô",
    "õ",
    "ö",
    "÷",
    "ø",
    "ù",
    "ú",
    "û",
    "ü",
    "ý",
    "þ",
    "ÿ",
};

void SerialDebugger_t::print(
  const char* title, void* buffer, size_t len, int columns, uint8_t radix, bool linesHeaders, bool addPrefixes, const char* sepString)
{
    if (title)
        _out.print(title);

    if (buffer == nullptr) {
        _out.println("  null");
        return;
    } else if (len == 0) {
        _out.println("  len == 0");
        return;
    }
    if (columns <= 0)
        columns = 16;

    std::function<void(uint8_t)> printVal;
    switch (radix) {
        case 2:
            printVal = [this](uint8_t val) { this->_out.print(val, 2); };
            break;
        case 8:
            printVal = [this](uint8_t val) { this->_out.print(val, 8); };
            break;
        case 10:
            printVal = [this](uint8_t val) { this->_out.print(val, DEC); };
            break;
        case 'a':
            [[fallthrough]];
        case 'A':
            printVal = [this](uint8_t val) {
                if (val == 0) {
                    this->_out.print('0');
                } else if (val < 0x20) {
                    this->_out.print(CONTROL_CHARS_TABLE[val]);
                } else if (val < 0x7F) {
                    this->_out.print((char)val);
                } else {
                    this->_out.print(EXTENDED_CHARS_TABLE[val - 0x80]);
                }
            };
            break;
        case 16:
            [[fallthrough]];
        default:
            if (addPrefixes)
                printVal = [this](uint8_t val) { this->_out.printf("0x%02x", val); };
            else
                printVal = [this](uint8_t val) { this->_out.printf("%02x", val); };
    }


    std::function<void(size_t)> printLineHeader;
    if (linesHeaders)
        printLineHeader = [this](int lnN) { this->_out.printf("[%08X] ", lnN); };
    else
        printLineHeader = [this](int) { this->_out.print("  "); };

    uint8_t* pByte  = (uint8_t*)buffer;
    size_t colCount = 0, charCount = 0;

    while (len--) {
        if (!colCount)
            printLineHeader(charCount);
        printVal(*pByte++);
        if (sepString != nullptr && len > 1)
            _out.print(sepString);


        if (++colCount == columns) {
            _out.print("\r\n");
            colCount = 0;
            _out.flush();
        } /*else {
            _out.print(" ");
        }*/
        charCount++;
    }
    _out.print("\r\n");
}


int SerialDebugger_t::readKey(bool waitForReception)
{
    if (waitForReception) {
        while (_out.read() > -1) {
            vTaskDelay(1);
        }
        do {
            int received = _out.read();
            if (received >= 0)
                return received;
        } while (1);
    }

    return _out.read();
}