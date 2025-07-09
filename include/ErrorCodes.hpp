// ErrorCodes.hpp
#ifndef ERROR_CODES_HPP
#define ERROR_CODES_HPP

#include <Arduino.h>

/**
 * @brief Enum for common error codes in the KibbleT5 system.
 */
enum class ErrorCode {
    SUCCESS = 0,
    UNKNOWN_ERROR,
    NOT_FOUND,
    INVALID_PARAMETERS,
    TANK_NOT_FOUND,
    TANK_DISCONNECTED,
    RECIPE_NOT_FOUND,
    SERVO_ERROR,
    SERVO_POWER_DISABLED,
    SCALE_ERROR,
    SCALE_NOT_CALIBRATED,
    SAFETY_VIOLATION,
    INSUFFICIENT_FOOD,
    HOPPER_DOOR_ERROR,
    CALIBRATION_REQUIRED,
    HARDWARE_FAULT,
    EEPROM_WRITE_ERROR,
    TIMEOUT_ERROR,
    // Add more specific errors as needed
};

/**
 * @brief Converts an ErrorCode enum value to its string representation.
 * @param code The ErrorCode to convert.
 * @return A C-style string representing the error code.
 */
const char* errorCodeToString(ErrorCode code);

#endif // ERROR_CODES_HPP


