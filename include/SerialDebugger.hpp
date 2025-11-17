#include <Arduino.h>
#include <HardwareSerial.h>

class SerialDebugger_t {
  public:
    SerialDebugger_t(Stream& output) : _out(output) {}
    void print(const char* title, void* buffer, size_t length, int columns = 16, uint8_t radix = 16, bool linesHeaders = false);

  private:
    Stream& _out;
};

extern SerialDebugger_t DebugSerial;