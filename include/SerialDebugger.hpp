#include <Arduino.h>
#include <HardwareSerial.h>

class SerialDebugger_t {
  public:
    SerialDebugger_t(Stream& output) : _out(output) {}
    /**
     * @brief Prints the content of a byte buffer
     * @param title Header of the print. Can be null.
     * @param buffer Buffer to print the bytes of. Accepts null and will be reported as such.
     * @param length  Number of bytes to print out. 
     * @param columns Number of values written per line. Set this to 0 to print all in a single line.
     * @param radix Radix of the value [2,8,16,'a']. Set this parameter to 'a' for ASCII values. Defaults to hex for any unsupported radix.
     * @param linesHeaders If <true>, prints line number address headers.
     * @param addPrefixes If <true>, adds radix prefix for octal (o) and hexadecimal (0x) radices.
     * @param sepString String of chars to be used as values separator. Defaults to a colon and a space, i.e ", " .
     */
    void print(const char* title, void* buffer, size_t length, int columns = 16, uint8_t radix = 16, bool linesHeaders = false, bool addPrefixes=true, const char* sepString = ", ");

    int readKey(bool waitForReception = false);
  private:
    Stream& _out;
};

extern SerialDebugger_t DebugSerial;