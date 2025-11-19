#include "SerialDebugger.hpp"
#include <functional>

SerialDebugger_t DebugSerial(Serial);

void SerialDebugger_t::print(
  const char* title, void* buffer, size_t len, int columns, uint8_t radix, bool linesHeaders, bool addPrefixes, const char* sepString)
{
    if (title)
        _out.print(title);
    if (buffer == nullptr)
        _out.println("  null");
    else if (len == 0)
        _out.println("  len == 0");
    else {
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
            case 16:
            [[fallthrough]]
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
        size_t colCount = 0, lineIndex = 0;

        while (len--) {
            if (!colCount)
                printLineHeader(lineIndex++);
            printVal(*pByte++);
            if (sepString != nullptr && len > 1)
                _out.print(sepString);


            if (++colCount == columns) {
                _out.print("\r\n");
                colCount = 0;
                _out.flush();
            } else {
                _out.print(" ");
            }
        }
        _out.print("\r\n");
    }
}