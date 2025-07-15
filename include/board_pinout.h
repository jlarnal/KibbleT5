#ifndef H_EPD_PINOUT_H
#define H_EPD_PINOUT_H

#define EDP_MOSI   (23)
#define EPD_CLK    (18)
#define EPD_DC     (17)
#define EPD_CS     (5)
#define EPD_BUSY   (4)
#define EPD_RST    (16)

#define TWEETER_PIN (25)


#define SERVO_POWER_ENABLE_PIN (15)

// The original ONE_WIRE_BUS is now replaced by an array for multiple buses.
// This allows for up to 6 tanks, each on its own bus for identification.
const int g_OneWireBusesPin[6] = {2, 19, 21, 22, 26, 27};


#define HX711_DATA_PIN  (14)
#define HX711_CLOCK_PIN (13)

#endif // H_EPD_PINOUT_H

