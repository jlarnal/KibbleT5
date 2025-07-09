#ifndef SERVOCONTROLLER_HPP
#define SERVOCONTROLLER_HPP

#include <Adafruit_PWMServoDriver.h>
#include "board_pinout.h"

// Constants for continuous rotation servos
#define SERVO_CONTINUOUS_STOP_PWM 1500
#define SERVO_CONTINUOUS_FWD_PWM  2000
#define SERVO_CONTINUOUS_REV_PWM  1000

// Default values for the hopper servo if no calibration is found
#define DEFAULT_HOPPER_CLOSED_PWM 1000
#define DEFAULT_HOPPER_OPEN_PWM   2000

class ServoController {
public:
    ServoController();

    // Begin now takes the pre-loaded calibration values
    void begin(uint16_t hopper_closed_pwm, uint16_t hopper_open_pwm);

    void setServoPWM(uint8_t servoNum, uint16_t pwm);
    void setServoPower(bool on);
    void setContinuousServo(uint8_t servoNum, float speed); // speed from -1.0 to 1.0
    void stopAllServos();
    void openHopper();
    void closeHopper();

private:
    Adafruit_PWMServoDriver _pwm;
    uint16_t _hopperOpenPwm;
    uint16_t _hopperClosedPwm;
};

#endif // SERVOCONTROLLER_HPP
