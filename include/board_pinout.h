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

// The original ONE_WIRE_BUS is now multiplexed through a 74HC4051 (analog multiplexer)
// This allows for up to 6 tanks, each on its own bus for identification.
#define ONEWIRE_MUX_notEnablePin (19)
#define ONEWIRE_MUX_S0_Pin (13)
#define ONEWIRE_MUX_S1_Pin (12)
#define ONEWIRE_MUX_S2_Pin (32)
#define ONEWIRE_MUX_DataPin (27)
#define ONEWIRE_MUX_VCC_Pin (33)

// Those two pins allow for communication with the HX711 strain gauge ADC.
#define HX711_DATA_PIN  (15)
#define HX711_CLOCK_PIN (14)

#endif // H_EPD_PINOUT_H

