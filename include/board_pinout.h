#ifndef H_EPD_PINOUT_H
#define H_EPD_PINOUT_H

#define EDP_MOSI   (23)
#define EPD_CLK    (18)
#define EPD_DC     (17)
#define EPD_CS     (5)
#define EPD_BUSY   (4)
#define EPD_RST    (16)

#define TWEETER_PIN (25)

#define BATT_HALFV_PIN (35)


#define SERVO_POWER_ENABLE_PIN (2)

// The original ONE_WIRE_BUS is now replaced by an array for multiple buses.
// This allows for up to 6 tanks, each on its own bus for identification.
const uint8_t g_OneWireBusesPin[6] = {19, 13, 27, 12, 32,33};


#define HX711_DATA_PIN  (15)
#define HX711_CLOCK_PIN (14)

#endif // H_EPD_PINOUT_H

