
#ifdef KIBBLET5_DEBUG_ENABLED

#include <Arduino.h>
#include <WiFi.h>
#include "test.h"
#include "board_pinout.h"
#include "esp_log.h"
//#include <hal/gpio_ll.h>
#include <hal/gpio_hal.h>
#include "SerialDebugger.hpp"


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

//// Helper function to wait for and read an integer from Serial, with echo
//static int readSerialInt()
//{
//    String input = "";
//    while (true) {
//        if (Serial.available()) {
//            char c = Serial.read();
//            if (c == '\n' || c == '\r') {
//                Serial.println(); // Move to next line after input is complete
//                if (input.length() > 0) {
//                    return input.toInt();
//                }
//            } else if (isDigit(c) || c == '-') {
//                input += c;
//                Serial.print(c); // Echo each character as it's typed
//            }
//        }
//        vTaskDelay(pdMS_TO_TICKS(10));
//    }
//}

// Helper function to wait for and read an integer from Serial, with echo and backspace handling
static int readSerialInt()
{
    String input = "";
    while (true) {
        if (Serial.available()) {
            char c = Serial.read();
            if (c == '\n' || c == '\r') {
                if (input.length() > 0) {
                    Serial.println(); // move to next line after input is complete
                    return input.toInt();
                } else {
                    Serial.println(); // keep terminal tidy if Enter pressed with empty input
                }
            } else if (c == '\b' || c == 127) { // backspace or DEL
                if (input.length() > 0) {
                    input.remove(input.length() - 1); // remove last character
                    Serial.print("\b \b"); // erase last char on terminal
                }
            } else if (isDigit(c) || (c == '-' && input.length() == 0)) {
                input += c;
                Serial.print(c); // echo each character as it's typed
            }
            // ignore any other characters
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}


// Helper function to wait for and read a float from Serial, with echo
static float readSerialFloat()
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

/** @brief Convert any POD value to its binary representation String, omitting leading zeroes. */
template <typename T> static String toBinaryString(const T& value)
{
    const uint8_t* bytes  = reinterpret_cast<const uint8_t*>(&value);
    const size_t bitCount = sizeof(T) * 8;

    // Locate highest set bit
    int firstOne = -1;
    for (int bit = bitCount - 1; bit >= 0; --bit) {
        size_t byteIdx = bit / 8;
#if BYTE_ORDER == LITTLE_ENDIAN
        uint8_t b = bytes[byteIdx];
#else
        uint8_t b = bytes[sizeof(T) - 1 - byteIdx];
#endif
        if (b & (1 << (bit % 8))) {
            firstOne = bit;
            break;
        }
    }

    if (firstOne < 0)
        return String("0");

    String result;
    result.reserve(firstOne + 1);

    // Emit bits MSB → LSB
    for (int bit = firstOne; bit >= 0; --bit) {
        size_t byteIdx = bit / 8;
#if BYTE_ORDER == LITTLE_ENDIAN
        uint8_t b = bytes[byteIdx];
#else
        uint8_t b = bytes[sizeof(T) - 1 - byteIdx];
#endif
        result += (b & (1 << (bit % 8))) ? '1' : '0';
    }

    return result;
}



// --- Test Sub-menus ---
void servoMoveMenu(TankManager& tankManager, int numServo)
{

    uint16_t pwm = 1500, prev = 0;
    constexpr uint16_t SMALL_STEP = 50, BIG_STEP = 250;
    int typed = 0;

    Serial.printf("\r\n[U]/[u] --> increase by %d or %d ms\r\n", BIG_STEP, SMALL_STEP);
    Serial.printf("[J]/[j] --> decrease by %d or %d ms\r\n", BIG_STEP, SMALL_STEP);
    Serial.printf("[C/c] --> set back to center (1500ms)\r\n");
    Serial.printf("[R/r] --> return to Servo Test Menu.\r\n");
    while (typed != 'r' && typed != 'R') {
        typed = Serial.read();
        switch (typed) {
            case 'u':
                pwm += SMALL_STEP;
                break;
            case 'U':
                pwm += BIG_STEP;
                break;
            case 'j':
                pwm -= SMALL_STEP;
                break;
            case 'J':
                pwm -= BIG_STEP;
                break;
            case 'c':
                [[fallthrough]];
            case 'C':
                pwm = 1500;
                break;
            default:
                break;
        }
        if (pwm < 250)
            pwm = 250;
        else if (pwm > 2750)
            pwm = 2750;


        if (prev != pwm) {
            Serial.print("\r                      \r");
            Serial.print(pwm);
            prev = pwm;
        }

        if (numServo > 0) {
            tankManager.setServoPWM((uint8_t)numServo, pwm);
        } else {
            for (int i = 0; i < NUMBER_OF_BUSES; i++)
                tankManager.setServoPWM(i, pwm);
        }
        vTaskDelay(pdMS_TO_TICKS(250));
    }
}

void servoTestMenu(TankManager& tankManager)
{
    bool testing = true;
    while (testing) {
        Serial.println("\n--- Servo Test Menu ---");
        Serial.println("1. Power Servos ON");
        Serial.println("2. Power Servos OFF");
        Serial.println("3. Set Single Servo PWM (μs)");
        Serial.println("4. Set All 8 Servos PWM (μs)");
        Serial.println("5. Set Continuous Servo Speed (-1.0 to 1.0)");
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
                tankManager.setServoPower(true);
                break;
            case '2':
                Serial.println("Powering servos OFF.");
                tankManager.setServoPower(false);
                break;
            case '3':
                {
                    Serial.print("Enter Servo Number (0-15): ");
                    int servoNum = readSerialInt();
                    if (servoNum < 0 || servoNum > 15) {
                        Serial.println("Invalid servo number.");
                        break;
                    }
                    servoMoveMenu(tankManager, servoNum);
                    break;
                }
            case '4':
                {
                    servoMoveMenu(tankManager, -1);
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
                    tankManager.setContinuousServo(servoNum, speed);
                    Serial.printf("Set continuous servo %d to speed %.2f.\n", servoNum, speed);
                    break;
                }
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

static void listenToPort(HardwareSerial& port)
{
    int typed;
    Serial.println("\r\nPress [Q]/[q] to stop listening.\r\n");
    while (Serial.available())
        Serial.read();
    do {
        if (port.available()) {
            int received = port.read();
            if (received > 0)
                Serial.print((char)received);
        }
        vTaskDelay(1);
        typed = Serial.read();
    } while (typed != 'q' && typed != 'Q');

    while (Serial.available())
        Serial.read();
}

static int findDiff(const void* pA, const void* pB, size_t length)
{
    if (pA == nullptr && pB == nullptr)
        return -3;
    else if (pA == nullptr)
        return -1;
    else if (pB == nullptr)
        return -2;
    uint8_t *b1 = (uint8_t*)pA, *b2 = (uint8_t*)pB;
    for (int index = 0; index < length; index++) {
        if (*b1++ != *b2++)
            return index;
    }
    return length;
}

void doReadTest(TankManager& tankManager, int busIndex)
{
    busIndex %= NUMBER_OF_BUSES;
    uint8_t* buff = (uint8_t*)malloc(128);
    if (!buff) {
        Serial.println("\r\nERROR: Could not allocate 128 bytes in internal RAM for the read buffer.");
        return;
    }
    memset(buff, 0, 128);
    Serial.printf("\r\nAttempting to read 128 bytes from offset 0 on device #%d...", busIndex);
    uint32_t endTime, startTime;
    startTime                = micros();
    SwiMuxSerialResult_e res = tankManager.testSwiRead(busIndex, 0, buff, 128);
    endTime                  = micros();
    if (res != SwiMuxSerialResult_e::SMREZ_OK) {
        Serial.printf("FAILED !!!\r\nRead error: %d\r\n", SwiMuxSerial_t::getResultValueName(res));
    } else {
        Serial.println("success");
    }
    Serial.printf("Read operation took %9.3f milliseconds.\r\n", (double)(endTime - startTime) * 1E-3);
    DebugSerial.print("Read buffer contents (ASCII):\r\n", buff, 128, 16, 'a', false, false, nullptr);
    DebugSerial.print("Read buffer contents (HEX):\r\n", buff, 128, 8, 16);

    if (buff)
        free(buff);
}

static constexpr size_t LOREM_LENGTH = 126;
static const char LOREM[LOREM_LENGTH]
  = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...";

void doWriteTest(TankManager& tankManager, int busIndex)
{
    busIndex %= NUMBER_OF_BUSES;
    uint32_t startTime, endTime;

    SwiMuxSerialResult_e res;
    uint8_t* initial_contents = (uint8_t*)calloc(128, 1); // store the initial contents
    char* dest                = (char*)calloc(LOREM_LENGTH, 1);
    char Lorem[126];
    strncpy(Lorem, LOREM, 126);


    Serial.print("Starting write test:\r\n • reading initial content: ");
    res = tankManager.testSwiRead(busIndex, 0, initial_contents, 128);
    if (res != SMREZ_OK) {
        Serial.printf("FAILED (%s)!!\r\n", SwiMuxSerial_t::getResultValueName(res));
        goto EndOfDoWriteTest;
    }
    Serial.println("ok\r\n");
    DebugSerial.print("Initial content:\r\n", initial_contents, 128, 0, 'a', false, false, "");

    Serial.print(" • writing `Lorem`: ");
    startTime = micros();
    res       = tankManager.testSwiWrite(busIndex, 0, (const uint8_t*)Lorem, LOREM_LENGTH);
    endTime   = micros();
    if (res != SMREZ_OK) {
        Serial.printf("FAILED (%s)!!\r\n", SwiMuxSerial_t::getResultValueName(res));
        goto EndOfDoWriteTest;
    }
    Serial.printf("ok (%9.3fms)\r\n • checking write buffer for writebacks: ", (double)(endTime - startTime) * 1E-3);
    {
        int diffPos = memcmp(LOREM, Lorem, LOREM_LENGTH);
        if (diffPos) {
            Serial.printf("FAILED !! Diff occurs @ char %d\r\n", diffPos);
            DebugSerial.print("Input buffer", Lorem, LOREM_LENGTH, 16, 16, false, false, nullptr);
            goto EndOfDoWriteTest;
        }
    }

    Serial.print("ok (none)\r\n • first readback from mem: ");
    res = tankManager.testSwiRead(busIndex, 0, (uint8_t*)dest, LOREM_LENGTH);
    if (res != SMREZ_OK) {
        Serial.printf("FAILED (%s)!!\r\n", SwiMuxSerial_t::getResultValueName(res));
        goto EndOfDoWriteTest;
    }

    Serial.print("ok\r\n • comparing written/read: ");
    {
        int diffPos = findDiff(Lorem, dest, LOREM_LENGTH);
        if (diffPos < 0) {
            Serial.printf("FAILED !! %s null\r\n", (diffPos == -1 ? "Lorem was" : (diffPos == -2 ? "dest was" : "both strings were")));
        } else if (diffPos < LOREM_LENGTH) {
            Serial.printf("FAILED @ char #%d\r\n", diffPos);
            Serial.flush();
            Serial.printf("Content: \"%s\"\r\n", (char*)dest);
            Serial.flush();
            DebugSerial.print("Raw: ", dest, 128);
            Serial.println();
            goto EndOfDoWriteTest;
        }
    }

    Serial.print("ok\r\n • random writes of '*': (press any key to proceed)\r\n");
    DebugSerial.readKey(true);
    {
        constexpr int RANDWRITES_ITERS_COUNT = 20;
        uint8_t aster                        = '*';
        uint16_t address                     = esp_random() % (127 - RANDWRITES_ITERS_COUNT);
        int64_t totTime                      = 0LL;
        for (int iter = 0; iter < RANDWRITES_ITERS_COUNT; iter++, address++) {
            startTime = micros();
            res       = tankManager.testSwiWrite(busIndex, address, &aster, 1);
            endTime   = micros();
            totTime += endTime - startTime;
            if (res != SMREZ_OK) {
                Serial.printf("FAILED to write at offset 0x%02x on iter #%d (err #%d, \"%s\") !\r\n", address, iter, res,
                  SwiMuxSerial_t::getResultValueName(res));
            } else {
                Serial.printf("successfully wrote at address %d in %9.3fms\r\n", address, (double)(endTime - startTime) * 1E-3);
            }
        }
        Serial.printf("Average write delay: %9.3f milliseconds.\r\n", ((double)totTime * 1E-3) / (double)RANDWRITES_ITERS_COUNT);
    }

    memset(dest, 0, LOREM_LENGTH);
    Serial.print("Done\r\n • second readback ");
    res = tankManager.testSwiRead(busIndex, 0, (uint8_t*)dest, LOREM_LENGTH);
    if (res != SMREZ_OK) {
        Serial.printf("FAILED (%s)!!\r\n", SwiMuxSerial_t::getResultValueName(res));
        goto EndOfDoWriteTest;
    }
    Serial.printf(" • resulting content: %s", dest);

    /*
    Serial.print("\r\n • restoring initial content:");
    res = tankManager.testSwiWrite(busIndex, 0, initial_contents, 128);
    if (res != SMREZ_OK) {
        Serial.printf("FAILED (%s) !! INITIAL CONTENT LOST !!\r\n", SwiMuxSerial_t::getResultValueName(res));
        goto EndOfDoWriteTest;
    }
    Serial.println("ok");
    */
EndOfDoWriteTest:
    free(dest);
    free(initial_contents);
    Serial.println();
    return;
}

void swiMuxMenu(TankManager& tankManager)
{
    bool testing = true;
    tankManager.setServoPower(false);
    while (testing) {
        Serial.println("\n--- SwiMux Test Menu ---");
        Serial.println("0. Get the presence map");
        Serial.println("1. Roll call (get all uids)");
        Serial.println("2. Scan a specific bus (0-5)");
        Serial.println("3. Scan all buses sequentially");
        Serial.println("4. Put SwiMux to sleep");
        Serial.println("5. Raw serial port access");
        Serial.println("6. Listen to serial port");
        Serial.println("7. Report bytes count in RX buffer");
        Serial.println("8. Perform read test.");
        Serial.println("9. Perform Write tests. (DATA WILL BE WIPED)");
        Serial.println("Q. Back to Main Menu");
        Serial.print("Enter choice: ");

        flushSerialInputBuffer();
        while (!Serial.available()) {
            vTaskDelay(pdMS_TO_TICKS(50));
        }
        char choice = Serial.read();
        Serial.print(choice);
        Serial.println();
        switch (choice) {
            case '0': // Get presence report
                {
                    SwiMuxPresenceReport_t res = tankManager.testSwiMuxAwaken();
                    if (res.busesCount) {
                        Serial.printf("The SwiMux interface awake, %d/%d tanks, map:%s.\r\n", __builtin_popcount(res.presences), res.busesCount,
                          toBinaryString(res.presences).c_str());
                    } else {
                        Serial.println("No response from the SwiMux interface !");
                    }
                }
                break;
            case '1':
                {
                    RollCallArray_t results;
                    if (tankManager.testRollCall(results)) {
                        Serial.printf("Result of the roll call:\r\n");
                        for (int idx = 0; idx < NUMBER_OF_BUSES; idx++) {
                            Serial.printf("  [%d]-> %016llX\r\n", idx, results.bus[idx]);
                        }
                    } else {
                        Serial.println("No answer.");
                    }
                }
                break;
            case '2': // Scan specific bus (gets UID)
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
                        Serial.printf(" uid read %08X%08X\r\n", (int32_t)(uid >> 32), (int32_t)(uid & UINT32_MAX));
                    } else {
                        Serial.println("no response.");
                    }
                }
                break;

            case '3':
                {
                    Serial.println("Scanning all SwiMux buses (0 to 5):\r\n");
                    for (int i = 0; i < 6; i++) {
                        uint64_t uid;
                        if (tankManager.testSwiBusUID(i, uid)) {
                            Serial.printf("\t[Bus #%d] uid reads %08x%08x\r\n", i, (uint32_t)(uid >> 32), (uint32_t)(uid & UINT32_MAX));
                        } else {
                            Serial.printf("\t[Bus #%d] no response.\r\n", i);
                        }
                        vTaskDelay(pdMS_TO_TICKS(100));
                    }
                }
                break;

            case '4':
                Serial.println("Putting SwiMux interface to sleep.");
                tankManager.disableSwiMux();
                break;

            case '5':
                Serial.println("Swimux interface serial port open.");
                Serial.println("Press \033[91m [Ctrl]+[Z] \033[0m to exit.");
                {
                    int outChar, inChar;
                    HardwareSerial& swiPort = tankManager.testGetSwiMuxPort();
                    do {
                        outChar = Serial.read();
                        if (outChar >= 0) {
                            swiPort.print((char)outChar);
                            Serial.print((char)outChar);
                        }

                        inChar = swiPort.read();
                        if (inChar >= 0) {
                            Serial.print((char)inChar);
                        }
                        vTaskDelay(1);
                    } while (outChar != 0x1A && inChar != 0x1A); // break upon 'SUB' (ctrl-z)
                }
                break;
            case '6':
                listenToPort(tankManager.testGetSwiMuxPort());
                break;
            case '7':
                Serial.printf("Bytes in buffer: %d\r\n\n", tankManager.testGetSwiMuxPort().available());
                break;
            case '8':
                Serial.print("\nWhich bus to read from ? [0-5]:");
                {
                    int busIndex = readSerialInt();
                    if (busIndex < 0 || busIndex > NUMBER_OF_BUSES) {
                        Serial.println("\r\nWrong value. Read abored.");
                        break;
                    }
                    flushSerialInputBuffer();
                    doReadTest(tankManager, busIndex);
                }
                break;
            case '9':
                Serial.print("\nWhich bus to write on ? [0-5]:");
                {
                    int busIndex = readSerialInt();
                    if (busIndex < 0 || busIndex > NUMBER_OF_BUSES) {
                        Serial.println("\r\nWrong value. Write abored.");
                        break;
                    }
                    Serial.print("Press [W] to start write test, any other key to abort:");
                    flushSerialInputBuffer();
                    {

                        int charVal;
                        do {
                            charVal = Serial.read();
                            if (charVal > 0) {
                                Serial.print((char)charVal);
                                if (charVal != 'w' && charVal != 'W') {
                                    Serial.println("\r\nWrite test aborted.");
                                    break;
                                }
                                Serial.println();
                                doWriteTest(tankManager, busIndex);
                                break;
                            }
                        } while (charVal <= 0);
                    }
                }
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
        Serial.flush();
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


// --- Main Test Function ---
#define WAITFORUARTDEBUG_PROMPT_STRING "Waiting for debug, press [ENTER] to proceed, any other key to skip."

void doDebugTest(TankManager& tankManager, HX711Scale& scale)
{
    Serial.println("\n\n--- KIBBLET5 HARDWARE DEBUG MODE ---");
    Serial.println("Press any key to enter the test menu...");
    Serial.flush();

    const char* promptStr = WAITFORUARTDEBUG_PROMPT_STRING;
    const uint32_t PERIOD = sizeof(WAITFORUARTDEBUG_PROMPT_STRING) - 1;

    // Purge input buffer
    flushSerialInputBuffer();
    uint32_t lastUpdTick = 0, idx = 0;
    int entry;
    do {
        entry = Serial.read();
        if ((millis() - lastUpdTick) > 33) {
            lastUpdTick = millis();
            if (idx < PERIOD) {
                Serial.print(promptStr[idx]);
            } else if (idx < PERIOD * 2) {
                vTaskDelay(1); // do nothing, keep the string printed for a full tick
            } else if (idx < PERIOD * 3) {
                printf("\b \b"); // backspace (rewind) before the char, print a space over it, then backspace (rewind) before the space itself.
            } else {
                idx = 0;
                continue;
            }
            idx++;
        }
    } while (entry < 0);

    if (entry != 13)
        return;

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
                servoTestMenu(tankManager);
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

#endif // defined(KIBBLET5_DEBUG_ENABLED)
