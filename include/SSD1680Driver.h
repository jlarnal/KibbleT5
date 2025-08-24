#ifndef H_SSD1680_DRIVER_H
#define H_SSD1680_DRIVER_H


#include <Adafruit_EPD.h>
#include <Adafruit_GFX.h>



class Ssd1680_Driver : public Adafruit_SSD1680 {
  public:
    Ssd1680_Driver(int width, int height, int16_t SID, int16_t SCLK, int16_t DC,
                   int16_t RST, int16_t CS, int16_t SRCS, int16_t MISO,
                   int16_t BUSY = -1)
        : Adafruit_SSD1680(width, height, SID, SCLK, DC, RST, CS, SRCS, MISO, BUSY)
    {}

    Ssd1680_Driver(int width, int height, int16_t DC, int16_t RST, int16_t CS, int16_t SRCS, int16_t BUSY = -1, SPIClass* spi = &SPI)
        : Adafruit_SSD1680(width, height, DC, RST, CS, SRCS, BUSY, spi)
    {}

    void powerUp(), update();
};

#endif // !H_SSD1680_DRIVER_H
