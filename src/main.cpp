#include <Arduino.h>
#include "esp_log.h"
#include "FS.h"

#include "DeviceState.hpp"
#include "ConfigManager.hpp"
#include "TimeKeeping.hpp"
#include "board_pinout.h"
#include "OneWireEEPROM.hpp"
#include "TankManager.hpp"
#include "ServoController.hpp"
#include "HX711Scale.hpp"
#include "RecipeProcessor.hpp"
#include "EPaperDisplay.hpp"
#include "SafetySystem.hpp"
#include "WebServer.hpp"
#include <SPIFFS.h>
#include "Battery.h"

// --- Global Objects ---
ConfigManager configManager("KibbleT5");
TimeKeeping timeKeeping(globalDeviceState, xDeviceStateMutex, configManager);
ServoController servoController;
TankManager tankManager(globalDeviceState, xDeviceStateMutex, &servoController);
HX711Scale scale(globalDeviceState, xDeviceStateMutex, configManager);
RecipeProcessor recipeProcessor(globalDeviceState, xDeviceStateMutex, configManager, tankManager, servoController, scale);
EPaperDisplay display(globalDeviceState, xDeviceStateMutex);
SafetySystem safetySystem(globalDeviceState, xDeviceStateMutex, servoController);
WebServer webServer(globalDeviceState, xDeviceStateMutex, configManager, recipeProcessor, tankManager, display);
Battery battMon(3000, 4200, BATT_HALFV_PIN);


static const char* TAG = "main";

void testOneWireGpios();

// --- Prototypes for RTOS Tasks ---
void feedingTask(void* pvParameters);
void batteryTask(void* pvParameters);

void setup()
{
    Serial.begin(115200);
    vTaskDelay(pdMS_TO_TICKS(1000));
    ESP_LOGI(TAG, "--- KibbleT5 Starting Up ---");

    xDeviceStateMutex = xSemaphoreCreateMutex();
    if (xDeviceStateMutex == NULL) {
        ESP_LOGE(TAG, "Fatal: Could not create device state mutex.");
        return;
    } else {
        ESP_LOGI(TAG, "Device stater mutex instanciated.");
    }

    if (!SPIFFS.begin()) {
        ESP_LOGE(TAG, "Fatal: Coult not initialize SPIFFS partition.");
        return;
    } else {
        ESP_LOGI(TAG, "SPIFFS partition mounted.");
        File root = SPIFFS.open("/");
        File file = root.openNextFile();
        ESP_LOGI(TAG, "Listing files in SPIFFS:");
        while (file) {
            ESP_LOGI(TAG, "  FILE: %s, SIZE: %d", file.name(), file.size());
            file = root.openNextFile();
        }
    }

    configManager.begin();
    display.begin();
    display.showBootScreen();
    vTaskDelay(pdMS_TO_TICKS(2000));

    bool wifiConnected = webServer.manageWiFiConnection();

    if (wifiConnected) {
        webServer.startAPIServer();

        timeKeeping.begin();

        // Launch the test subprogram helping us debug the oneWire buses power logic (see "IMPORTANT NOTE" in `Tankmanager.cpp`)
        testOneWireGpios();

        // Load hopper calibration from config
        uint16_t hopper_closed, hopper_open;
        configManager.loadHopperCalibration(hopper_closed, hopper_open);
        // Initialize servo controller with the loaded values
        servoController.begin(hopper_closed, hopper_open);

        tankManager.begin();
        scale.begin(HX711_DATA_PIN, HX711_CLOCK_PIN);
        recipeProcessor.begin();

        timeKeeping.startTask();
        tankManager.startTask();
        scale.startTask();
        display.startTask();
        safetySystem.startTask();

        xTaskCreate(feedingTask, "Feeding Task", 4096, &recipeProcessor, 10, NULL);
        xTaskCreate(batteryTask, "Batt monitor", 2048, &battMon, tskIDLE_PRIORITY, NULL);
        ESP_LOGI(TAG, "--- Setup Complete, System Operational ---");
    } else {
        ESP_LOGE(TAG, "Fatal: WiFi could not be configured. Halting.");
        display.showError("WiFi Failed", "Halting system.");
    }
}

void loop() { vTaskDelete(NULL); }

void batteryTask(void* pvParameters)
{
    if (pvParameters == nullptr) {
        ESP_LOGE(TAG, "Battery object pointer was null in `batteryTask`");
        return;
    }

    Battery* pBatt = (Battery*)pvParameters;
    pBatt->begin(3300, 2.0f, asigmoidal);

    for (;;) {
        globalDeviceState.batteryLevel = pBatt->level();
        vTaskDelay(5000);
    }
}

void feedingTask(void* pvParameters)
{
    RecipeProcessor* processor = (RecipeProcessor*)pvParameters;
    ESP_LOGI(TAG, "Feeding Task Started.");

    for (;;) {
        FeedCommand command = {};
        bool commandPresent = false;

        if (xSemaphoreTake(xDeviceStateMutex, portMAX_DELAY) == pdTRUE) {
            if (!globalDeviceState.feedCommand.processed) {
                command                                 = globalDeviceState.feedCommand;
                globalDeviceState.feedCommand.processed = true;
                commandPresent                          = true;
            }
            xSemaphoreGive(xDeviceStateMutex);
        }

        if (commandPresent) {
            bool success = false;
            ESP_LOGI(TAG, "Processing new command: %d", (int)command.type);

            if (xSemaphoreTake(xDeviceStateMutex, portMAX_DELAY) == pdTRUE) {
                globalDeviceState.currentFeedingStatus = "Processing...";
                xSemaphoreGive(xDeviceStateMutex);
            }

            switch (command.type) {
                case FeedCommandType::IMMEDIATE:
                    // Pass the tankUid along with the amount, as required by the updated function signature.
                    success = processor->executeImmediateFeed(command.tankUid, command.amountGrams);
                    break;
                case FeedCommandType::RECIPE:
                    success = processor->executeRecipeFeed(command.recipeId);
                    break;
                case FeedCommandType::TARE_SCALE:
                    processor->getScale().tare();
                    success = true;
                    break;
                case FeedCommandType::EMERGENCY_STOP:
                    processor->stopAllFeeding();
                    success = true;
                    break;
                default:
                    ESP_LOGW(TAG, "Unknown command type in feeding task.");
                    break;
            }

            if (xSemaphoreTake(xDeviceStateMutex, portMAX_DELAY) == pdTRUE) {
                globalDeviceState.currentFeedingStatus = success ? "Idle" : "Error";
                if (!success) {
                    // Keep the error message that was set by the processor
                } else {
                    globalDeviceState.lastError = "";
                }
                globalDeviceState.feedCommand.type = FeedCommandType::NONE;
            }
            xSemaphoreGive(xDeviceStateMutex);
        }

        vTaskDelay(pdMS_TO_TICKS(200));
    }
}


/** @brief Print the levels of the GPIOs used for oneWire buses. This is a sattelite function to `testOneWireGpios`.*/
static void printOneWireBusLevels(int driveBusIndex = -1)
{
    Serial.print("Levels seens on buses after 300ms: ");
    for (int idx = 0; idx < 6; idx++) {
        int lvl = digitalRead(g_OneWireBusesPin[idx]);
        if (idx == driveBusIndex)
            Serial.printf("\033[4m%c\033[0m", (lvl ? '1' : '0'));
        else
            Serial.printf("%c", (lvl ? '1' : '0'));
    }
    Serial.print("\033[0m\n"); // Force back normal format and jump line.
}

/** @brief Suspends operations and allows the dev to perform thorough test on the GPIOs used as oneWire buses. */
void testOneWireGpios()
{
    while (Serial.available())
        Serial.read();

    Serial.println(
      "Starting one wire bus tests.\n  Press 'n' for next bus\n        'p' for previous bus\n        't' to toggle level\n        'i' to "
      "make all lines inputs\n        'r' to show levels\n        'q' to end test\n");
    int busIndex = 0, changeDir = 0, desiredLevel = HIGH, lowPullIdx;
    bool testing = true;
    bool changed = true; // by default, to initiate the fist GPIO setup.
    while (testing) {
        if (Serial.available()) {
            int entry = Serial.read();

            // In any case, echo the received character on its own line.
            if (entry)
                Serial.printf("%c\n", entry);

            switch (entry) {
                case 'r':
                [[fallthrough]]
                case 'R':
                    printOneWireBusLevels(busIndex);
                    break;

                case 'n':
                [[fallthrough]]
                case 'N':
                    changeDir = 1;
                    changed   = true;
                    break;
                case 'p':
                [[fallthrough]]
                case 'P':
                    changeDir = -1;
                    changed   = true;
                    break;
                case 't':
                [[fallthrough]]
                case 'T':

                    desiredLevel = desiredLevel == LOW ? HIGH : LOW;
                    changeDir    = 0;
                    changed      = true;
                    Serial.printf("Toggling level of bus #%d (%d) from %s\n", busIndex, g_OneWireBusesPin[busIndex],
                      (desiredLevel ? "HIGH to  LOW" : "LOW to HIGH"));
                    break;
                case 'i':
                [[fallthrough]]
                case 'I':
                    Serial.println("Resetting all buses lines to inputs.");
                    changeDir = 0;
                    changed   = false;
                    digitalWrite(g_OneWireBusesPin[busIndex], LOW);
                    pinMode(g_OneWireBusesPin[busIndex], INPUT);
                    vTaskDelay(300);
                    printOneWireBusLevels();
                    break;
                case 'q':
                [[fallthrough]]
                case 'Q':
                    digitalWrite(g_OneWireBusesPin[busIndex], LOW);
                    pinMode(g_OneWireBusesPin[busIndex], INPUT);
                    testing = false;
                    Serial.println("Quitting the one wire bus GPIO test, resuming operations.");
                    break;
                case '0':
                [[fallthrough]]
                case '1':
                [[fallthrough]]
                case '2':
                [[fallthrough]]
                case '3':
                [[fallthrough]]
                case '4':
                [[fallthrough]]
                case '5':
                    lowPullIdx = entry - '0';
                    if (lowPullIdx != busIndex) {
                        Serial.printf("Pulling bus #%d (%d) low through open drain.\n", lowPullIdx, g_OneWireBusesPin[lowPullIdx]);
                        pinMode(g_OneWireBusesPin[lowPullIdx], OUTPUT_OPEN_DRAIN);
                        digitalWrite(g_OneWireBusesPin[lowPullIdx], LOW);
                        vTaskDelay(300);
                        printOneWireBusLevels(busIndex);
                        pinMode(g_OneWireBusesPin[lowPullIdx], INPUT);
                        changed   = false;
                        changeDir = 0;
                    }
                    break;
                default:
                    break;
            }


            if (changed) {
                changed = false; // it won't be "changed" on next loop
                // Revert the previous pin to input.
                if (changeDir != 0) {
                    Serial.printf("Configuring pin #%d for bus %d to high-Z.\n", g_OneWireBusesPin[busIndex], busIndex);
                    digitalWrite(g_OneWireBusesPin[busIndex], LOW);
                    pinMode(g_OneWireBusesPin[busIndex], INPUT);
                }
                if (changeDir > 0) { // increment bus index
                    if (busIndex >= 5) // not just greater but greater OR EQUAL (failsafe)
                        busIndex = 0;
                    else
                        busIndex++;
                } else if (changeDir < 0) { // decrement bus index
                    if (busIndex <= 0) // not just lesser but lesser OR EQUAL (failsafe)
                        busIndex = 5;
                    else
                        busIndex--;
                }
                // lose the direction.
                changeDir = 0;
                // Change the new bus pin mode & state
                Serial.printf("Setting pin #%d for bus %d to high level (3.3V)\n", g_OneWireBusesPin[busIndex], busIndex);
                pinMode(g_OneWireBusesPin[busIndex], OUTPUT);
                digitalWrite(g_OneWireBusesPin[busIndex], desiredLevel);

                vTaskDelay(300);
                printOneWireBusLevels(busIndex);
            }
            vTaskDelay(50);
        }
    }
}