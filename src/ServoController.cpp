#include "ServoController.hpp"
#include "esp_log.h"

static const char* TAG = "ServoController";

ServoController::ServoController()
    : _pwm(Adafruit_PWMServoDriver()),
      _hopperOpenPwm(DEFAULT_HOPPER_OPEN_PWM), 
      _hopperClosedPwm(DEFAULT_HOPPER_CLOSED_PWM) {}

// The controller is now initialized with its configuration.
// It doesn't need a ConfigManager pointer anymore.
void ServoController::begin(uint16_t hopper_closed_pwm, uint16_t hopper_open_pwm) {
    _hopperClosedPwm = hopper_closed_pwm;
    _hopperOpenPwm = hopper_open_pwm;

    _pwm.begin();
    _pwm.setPWMFreq(50); // Standard servo frequency
    pinMode(SERVO_POWER_ENABLE_PIN, OUTPUT);
    digitalWrite(SERVO_POWER_ENABLE_PIN, HIGH); // Start with power off (HIGH for active-low)

    ESP_LOGI(TAG, "Servo Controller Initialized. Hopper cal: Open=%d, Closed=%d", _hopperOpenPwm, _hopperClosedPwm);
}

void ServoController::setServoPWM(uint8_t servoNum, uint16_t pwm) {
    if (servoNum >= 16) return;
    uint16_t ticks = map(pwm, 0, 20000, 0, 4095);
    _pwm.setPWM(servoNum, 0, ticks);
}

void ServoController::setServoPower(bool on) {
    // Corrected for active-low logic:
    // ON = LOW, OFF = HIGH
    digitalWrite(SERVO_POWER_ENABLE_PIN, on ? LOW : HIGH);
    ESP_LOGI(TAG, "Servo power %s", on ? "ON" : "OFF");
}

void ServoController::setContinuousServo(uint8_t servoNum, float speed) {
    if (speed > 1.0) speed = 1.0;
    if (speed < -1.0) speed = -1.0;

    if (abs(speed) < 0.01) {
        setServoPWM(servoNum, SERVO_CONTINUOUS_STOP_PWM);
    } else if (speed > 0) {
        uint16_t pwm = map(speed * 100, 0, 100, SERVO_CONTINUOUS_STOP_PWM, SERVO_CONTINUOUS_FWD_PWM);
        setServoPWM(servoNum, pwm);
    } else {
        uint16_t pwm = map(speed * 100, -100, 0, SERVO_CONTINUOUS_REV_PWM, SERVO_CONTINUOUS_STOP_PWM);
        setServoPWM(servoNum, pwm);
    }
}

void ServoController::stopAllServos() {
    for (uint8_t i = 0; i < 16; i++) {
        setContinuousServo(i, 0.0);
    }
    ESP_LOGW(TAG, "All servos stopped.");
}

void ServoController::openHopper() {
    setServoPWM(0, _hopperOpenPwm);
}

void ServoController::closeHopper() {
    setServoPWM(0, _hopperClosedPwm);
}
