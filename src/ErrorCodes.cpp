// ErrorCodes.cpp
#include "ErrorCodes.hpp"

/**
 * @brief Converts an ErrorCode enum value to its string representation.
 * @param code The ErrorCode to convert.
 * @return A C-style string representing the error code.
 */
const char* errorCodeToString(ErrorCode code) {
    switch (code) {
        case ErrorCode::SUCCESS: return "SUCCESS";
        case ErrorCode::UNKNOWN_ERROR: return "UNKNOWN_ERROR";
        case ErrorCode::NOT_FOUND: return "NOT_FOUND";
        case ErrorCode::INVALID_PARAMETERS: return "INVALID_PARAMETERS";
        case ErrorCode::TANK_NOT_FOUND: return "TANK_NOT_FOUND";
        case ErrorCode::TANK_DISCONNECTED: return "TANK_DISCONNECTED";
        case ErrorCode::RECIPE_NOT_FOUND: return "RECIPE_NOT_FOUND";
        case ErrorCode::SERVO_ERROR: return "SERVO_ERROR";
        case ErrorCode::SERVO_POWER_DISABLED: return "SERVO_POWER_DISABLED";
        case ErrorCode::SCALE_ERROR: return "SCALE_ERROR";
        case ErrorCode::SCALE_NOT_CALIBRATED: return "SCALE_NOT_CALIBRATED";
        case ErrorCode::SAFETY_VIOLATION: return "SAFETY_VIOLATION";
        case ErrorCode::INSUFFICIENT_FOOD: return "INSUFFICIENT_FOOD";
        case ErrorCode::HOPPER_DOOR_ERROR: return "HOPPER_DOOR_ERROR";
        case ErrorCode::CALIBRATION_REQUIRED: return "CALIBRATION_REQUIRED";
        case ErrorCode::HARDWARE_FAULT: return "HARDWARE_FAULT";
        case ErrorCode::EEPROM_WRITE_ERROR: return "EEPROM_WRITE_ERROR";
        case ErrorCode::TIMEOUT_ERROR: return "TIMEOUT_ERROR";
        default: return "UNDEFINED_ERROR";
    }
}

