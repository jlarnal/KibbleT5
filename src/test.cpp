#include <Arduino.h>
#include <WiFi.h>
#include "test.h"
#include "board_pinout.h"
#include "esp_log.h"
//#include <hal/gpio_ll.h>
#include <hal/gpio_hal.h>

static const char* TAG = "DebugTest";

/**
 * @brief Clears any pending characters from the serial input buffer.
 */
static void flushSerialInputBuffer()
{
    while (Serial.available()) {
        Serial.read();
    }
}

// Helper function to wait for and read an integer from Serial, with echo
int readSerialInt()
{
    String input = "";
    while (true) {
        if (Serial.available()) {
            char c = Serial.read();
            if (c == '\n' || c == '\r') {
                Serial.println(); // Move to next line after input is complete
                if (input.length() > 0) {
                    return input.toInt();
                }
            } else if (isDigit(c) || c == '-') {
                input += c;
                Serial.print(c); // Echo each character as it's typed
            }
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

// Helper function to wait for and read a float from Serial, with echo
float readSerialFloat()
{
    String input = "";
    while (true) {
        if (Serial.available()) {
            char c = Serial.read();
            if (c == '\n' || c == '\r') {
                Serial.println(); // Move to next line after input is complete
                if (input.length() > 0) {
                    return input.toFloat();
                }
            } else if (isDigit(c) || c == '.' || c == '-') {
                input += c;
                Serial.print(c); // Echo each character as it's typed
            }
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}


// --- Test Sub-menus ---

void lowLevelServoMenu(ServoController& servoController)
{
    bool testing = true;
    while (testing) {
        Serial.println("\n--- Low-Level Servo Test ---");
        Serial.println("1. Set Raw PWM Ticks (0-4095)");
        Serial.println("q. Back to Servo Menu");
        Serial.print("Enter choice: ");

        flushSerialInputBuffer();
        while (!Serial.available()) {
            vTaskDelay(pdMS_TO_TICKS(50));
        }
        char choice = Serial.read();
        Serial.print(choice);
        Serial.println();

        switch (choice) {
            case '1':
                {
                    Serial.print("Enter Servo Channel (0-15): ");
                    int servoNum = readSerialInt();
                    if (servoNum < 0 || servoNum > 15) {
                        Serial.println("Invalid channel.");
                        break;
                    }
                    Serial.print("Enter Raw Ticks (0-4095): ");
                    int ticks = readSerialInt();
                    if (ticks < 0 || ticks > 4095) {
                        Serial.println("Invalid tick value.");
                        break;
                    }
                    // This requires a new public method in ServoController like:
                    // void setServoTicks(uint8_t servoNum, uint16_t ticks) { _pwm.setPWM(servoNum, 0, ticks); }
                    // servoController.setServoTicks(servoNum, ticks);
                    Serial.printf("Set servo %d to %d raw ticks. (Requires ServoController modification)\n", servoNum, ticks);
                    break;
                }
            case 'q':
            [[fallthrough]]
            case 'Q':
                testing = false;
                break;
            default:
                Serial.println("Invalid choice.");
                break;
        }
    }
}

void servoTestMenu(ServoController& servoController)
{
    bool testing = true;
    while (testing) {
        Serial.println("\n--- Servo Test Menu ---");
        Serial.println("1. Power Servos ON");
        Serial.println("2. Power Servos OFF");
        Serial.println("3. Set Single Servo PWM (μs)");
        Serial.println("4. Set All 8 Servos PWM (μs)");
        Serial.println("5. Set Continuous Servo Speed (-1.0 to 1.0)");
        Serial.println("6. Low-Level Mode (Raw Ticks)");
        Serial.println("q. Back to Main Menu");
        Serial.print("Enter choice: ");

        flushSerialInputBuffer();
        while (!Serial.available()) {
            vTaskDelay(pdMS_TO_TICKS(50));
        }
        char choice = Serial.read();
        Serial.print(choice);
        Serial.println();

        switch (choice) {
            case '1':
                Serial.println("Powering servos ON.");
                servoController.setServoPower(true);
                break;
            case '2':
                Serial.println("Powering servos OFF.");
                servoController.setServoPower(false);
                break;
            case '3':
                {
                    Serial.print("Enter Servo Number (0-15): ");
                    int servoNum = readSerialInt();
                    if (servoNum < 0 || servoNum > 15) {
                        Serial.println("Invalid servo number.");
                        break;
                    }
                    Serial.print("Enter PWM value (e.g., 1000-2000): ");
                    int pwm = readSerialInt();
                    servoController.setServoPWM(servoNum, pwm);
                    Serial.printf("Set servo %d to %d μs.\n", servoNum, pwm);
                    break;
                }
            case '4':
                {
                    Serial.print("Enter PWM value for all 8 servos: ");
                    int pwm = readSerialInt();
                    for (int i = 0; i < 8; i++) {
                        servoController.setServoPWM(i, pwm);
                    }
                    Serial.printf("Set servos 0-7 to %d μs.\n", pwm);
                    break;
                }
            case '5':
                {
                    Serial.print("Enter Servo Number (0-15): ");
                    int servoNum = readSerialInt();
                    if (servoNum < 0 || servoNum > 15) {
                        Serial.println("Invalid servo number.");
                        break;
                    }
                    Serial.print("Enter speed (-1.0 to 1.0): ");
                    float speed = readSerialFloat();
                    servoController.setContinuousServo(servoNum, speed);
                    Serial.printf("Set continuous servo %d to speed %.2f.\n", servoNum, speed);
                    break;
                }
            case '6':
                lowLevelServoMenu(servoController);
                break;
            case 'q':
            [[fallthrough]]
            case 'Q':
                testing = false;
                break;
            default:
                Serial.println("Invalid choice.");
                break;
        }
    }
}


void swiMuxMenu(TankManager& tankManager)
{
    bool testing = true;
    while (testing) {
        Serial.println("\n--- SwiMux Test Menu ---");
        Serial.println("1. Awaken the SwiMux (tests for readyness)");
        Serial.println("2. Scan a specific bus (0-5)");
        Serial.println("3. Scan all buses sequentially");
        Serial.println("4. Put SwiMux to sleep");
        Serial.println("q. Back to Main Menu");
        Serial.print("Enter choice: ");

        flushSerialInputBuffer();
        while (!Serial.available()) {
            vTaskDelay(pdMS_TO_TICKS(50));
        }
        char choice = Serial.read();
        Serial.print(choice);
        Serial.println();

        switch (choice) {
            case '1':
                if (tankManager.testSwiMuxAwaken()) {
                    Serial.println("The SwiMux interface said it's awake.");
                } else {
                    Serial.println("No response from the SwiMux interface !");
                }
                break;

            case '2':
                {
                    Serial.print("Enter bus number to scan [0..5]:>");
                    int busIndex = readSerialInt();
                    Serial.println(busIndex);
                    if (busIndex < 0 || busIndex > 5) {
                        Serial.println("Wrong bus index.");
                        break;
                    }
                    Serial.printf("Scanning SwiMux bus #%d...", busIndex);
                    uint64_t uid;
                    if (tankManager.testSwiBusUID(busIndex, uid)) {
                        Serial.printf(" uid read: %08x%08x\r\n", (uint32_t)(uid >> 32), (uint32_t)(uid & UINT32_MAX));
                    } else {
                        Serial.println("no response.");
                    }
                }
                break;

            case '3':
                {
                    Serial.println("Scanning all SwiMux buses (0 to 5):");
                    for (int i = 0; i < 6; i++) {
                        uint64_t uid;
                        if (tankManager.testSwiBusUID(i, uid)) {
                            Serial.printf("\t[Bus #%d] uid read: %08x%08x\r\n", i, (uint32_t)(uid >> 32), (uint32_t)(uid & UINT32_MAX));
                        } else {
                            Serial.printf("\t[Bus #%d] no response.", i);
                        }
                        vTaskDelay(pdMS_TO_TICKS(100));
                    }
                }
                break;

            case '4':
                Serial.println("Putting SwiMux interface to sleep.");
                tankManager.disableSwiMux();
                break;

            case 'q':
                [[fallthrough]];
            case 'Q':
                testing = false;
                break;

            default:
                Serial.println("Invalid choice.");
                break;
        }
    }
}

void runCalibrationSequence(HX711Scale& scale)
{
    Serial.println("\n--- 10g Calibration Sequence ---");
    Serial.println("Step 1: Please remove all weight from the scale.");
    Serial.println("Press any key to continue...");
    flushSerialInputBuffer();
    while (!Serial.available()) {
        vTaskDelay(pdMS_TO_TICKS(50));
    }
    flushSerialInputBuffer();

    Serial.println("Taring scale... please wait.");
    scale.tare();
    Serial.printf("Tare complete. New offset: %ld\n", scale.getZeroOffset());

    Serial.println("\nStep 2: Place a known 10 gram weight on the scale.");
    Serial.println("Press any key when ready...");
    flushSerialInputBuffer();
    while (!Serial.available()) {
        vTaskDelay(pdMS_TO_TICKS(50));
    }
    flushSerialInputBuffer();

    Serial.println("Calibrating...");
    float newFactor = scale.calibrateWithKnownWeight(10.0f);
    Serial.printf("Calibration complete. New factor: %.4f\n", newFactor);
    Serial.println("Calibration parameters are now active but NOT SAVED.");
    Serial.println("Use the 'Save Calibration' option to persist them.");
}

void scaleTestMenu(HX711Scale& scale)
{
    bool testing = true;
    while (testing) {
        Serial.println("\n--- Scale (HX711) Test Menu ---");
        Serial.println("1. Monitor Scale (Plotter Mode)");
        Serial.println("2. Tare Scale");
        Serial.println("3. Run 10g Calibration Sequence");
        Serial.println("4. Save Calibration to NVS");
        Serial.println("q. Back to Main Menu");
        Serial.print("Enter choice: ");

        flushSerialInputBuffer();
        while (!Serial.available()) {
            vTaskDelay(pdMS_TO_TICKS(50));
        }
        char choice = Serial.read();
        Serial.print(choice);
        Serial.println();

        switch (choice) {
            case '1':
                {
                    Serial.println("\nPrinting plotter-compatible data. Send any character to stop.");
                    Serial.println("Raw:0,Avg:0,Weight:0.0"); // Header for plotter

                    const int numSamples     = 8;
                    long samples[numSamples] = { 0 };
                    int sampleIndex          = 0;
                    long sum                 = 0;

                    // Reset sliding window on each run
                    for (int i = 0; i < numSamples; ++i)
                        samples[i] = 0;

                    flushSerialInputBuffer();

                    while (!Serial.available()) {
                        long raw     = scale.getRawReading();
                        float weight = scale.getWeight();

                        sum -= samples[sampleIndex];
                        samples[sampleIndex] = raw;
                        sum += raw;
                        sampleIndex = (sampleIndex + 1) % numSamples;
                        long avg    = sum / numSamples;

                        Serial.printf("Raw:%ld,Avg:%ld,Weight:%.2f\n", raw, avg, weight);
                        Serial.flush();
                        vTaskDelay(pdMS_TO_TICKS(100));
                    }

                    flushSerialInputBuffer();
                    Serial.println("Stopping scale monitor.");
                    break;
                }
            case '2':
                Serial.println("Taring scale... please wait.");
                scale.tare();
                Serial.printf("Tare complete. New offset: %ld\n", scale.getZeroOffset());
                Serial.println("Note: This tare is temporary. Save to make it permanent.");
                break;
            case '3':
                runCalibrationSequence(scale);
                break;
            case '4':
                Serial.println("Saving current calibration factor and offset to NVS...");
                scale.saveCalibration();
                Serial.println("Save complete.");
                break;
            case 'q':
            [[fallthrough]]
            case 'Q':
                testing = false;
                break;
            default:
                Serial.println("Invalid choice.");
                break;
        }
    }
}


// --- Main Test Function ---

void doDebugTest(ServoController& servoController, TankManager& tankManager, HX711Scale& scale)
{
    Serial.println("\n\n--- KIBBLET5 HARDWARE DEBUG MODE ---");
    Serial.println("Press any key to enter the test menu...");
    Serial.flush();

    int timeout = 100; // 10 seconds
    while (!Serial.available() && timeout > 0) {
        vTaskDelay(pdMS_TO_TICKS(100));
        timeout--;
    }

    if (!Serial.available()) {
        Serial.println("No input detected, resuming normal operation.");
        return;
    }

    flushSerialInputBuffer();

    bool testing = true;
    while (testing) {
        Serial.println("\n--- Main Test Menu ---");
        Serial.println("1. Servo Tests (PCA9685)");
        Serial.println("2. SwiMux tests (AT21CS01 chips through a CH32V003)");
        Serial.println("3. Scale Tests (HX711)");
        Serial.println("q. Quit and Resume Operation");
        Serial.print("Enter choice: ");

        flushSerialInputBuffer();
        while (!Serial.available()) {
            vTaskDelay(pdMS_TO_TICKS(50));
        }
        char choice = Serial.read();
        Serial.print(choice);
        Serial.println();

        switch (choice) {
            case '1':
                servoTestMenu(servoController);
                break;
            case '2':
                swiMuxMenu(tankManager);
                break;
            case '3':
                scaleTestMenu(scale);
                break;
            case 'q':
                testing = false;
                Serial.println("Exiting debug mode, resuming normal operation.");
                break;
            default:
                Serial.println("Invalid choice.");
                break;
        }
    }
}
