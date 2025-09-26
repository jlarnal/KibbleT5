#include <Arduino.h>
#include "esp_log.h"
#include "FS.h"
#include <WiFi.h>
#include <ArduinoOTA.h>

#include "DeviceState.hpp"
#include "ConfigManager.hpp"
#include "TimeKeeping.hpp"
#include "board_pinout.h"
#include "TankManager.hpp"
#include "HX711Scale.hpp"
#include "RecipeProcessor.hpp"
#include "EPaperDisplay.hpp"
#include "SafetySystem.hpp"
#include "WebServer.hpp"
#include <SPIFFS.h>
#include "Battery.h"
#include "test.h" // Include the new test header

// --- Global Objects ---
ConfigManager configManager("KibbleT5");
TimeKeeping timeKeeping(globalDeviceState, xDeviceStateMutex, configManager);
TankManager tankManager(globalDeviceState, xDeviceStateMutex);
HX711Scale scale(globalDeviceState, xDeviceStateMutex, configManager);
RecipeProcessor recipeProcessor(globalDeviceState, xDeviceStateMutex, configManager, tankManager, scale);
EPaperDisplay display(globalDeviceState, xDeviceStateMutex);
SafetySystem safetySystem(globalDeviceState, xDeviceStateMutex, tankManager);
WebServer webServer(globalDeviceState, xDeviceStateMutex, configManager, recipeProcessor, tankManager, display);
Battery battMon(3000, 4200, BATT_HALFV_PIN);


static const char* TAG    = "main";
static const char* OTATAG = "OTA update";

// --- Prototypes for RTOS Tasks ---
void feedingTask(void* pvParameters);
void battAndOTA_Task(void* pvParameters);

void setup()
{
    Serial.setTxBufferSize(1024);
    Serial.setDebugOutput(true);
    Serial.begin(115200);
    
    ESP_LOGI(TAG, "--- KibbleT5 Starting Up ---");

    xDeviceStateMutex = xSemaphoreCreateMutex();
    if (xDeviceStateMutex == NULL) {
        ESP_LOGE(TAG, "Fatal: Could not create device state mutex.");
        return;
    } else {
        ESP_LOGI(TAG, "Device state mutex instantiated.");
    }

    if (!SPIFFS.begin()) {
        ESP_LOGE(TAG, "Fatal: Could not initialize SPIFFS partition.");
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

    // Initialize hardware before running tests
    uint16_t hopper_closed, hopper_open;
    configManager.loadHopperCalibration(hopper_closed, hopper_open);
    tankManager.begin(hopper_closed, hopper_open);
    scale.begin(HX711_DATA_PIN, HX711_CLOCK_PIN);

    // --- RUN DIAGNOSTIC AND TEST CLI ---
    doDebugTest(tankManager, scale);


    bool wifiConnected = webServer.manageWiFiConnection();

    if (wifiConnected) {

        ESP_LOGI(TAG, "IP address is %s", WiFi.localIP().toString().c_str());
        ArduinoOTA.begin();
        xTaskCreate(battAndOTA_Task, "Batt monitor", 3192, &battMon, 10, NULL);


        webServer.startAPIServer(); // 1
        timeKeeping.begin(); // 2
        timeKeeping.startTask(); // 4
        safetySystem.startTask(); // 5
        scale.startTask(); // 8
        tankManager.startTask(); // 6
        recipeProcessor.begin(); // 3
        display.startTask(); // 7
        xTaskCreate(feedingTask, "Feeding Task", 4096, &recipeProcessor, 10, NULL);


        ESP_LOGI(TAG, "--- Setup Complete, System Operational ---");
    } else {
        ESP_LOGE(TAG, "Fatal: WiFi could not be configured. Halting.");
        display.showError("WiFi Failed", "Halting system.");
    }
}

void loop()
{
    vTaskDelete(NULL);
}

void battAndOTA_Task(void* pvParameters)
{
    if (pvParameters == nullptr) {
        ESP_LOGE(TAG, "Battery object pointer was null in `batteryTask`");
        return;
    } else {
        ESP_LOGI(TAG, "Battery manager running.");
        Serial.flush();
    }

    Battery* pBatt = (Battery*)pvParameters;
    pBatt->begin(3300, 0.5f, asigmoidal);

    for (;;) {

        globalDeviceState.batteryLevel = pBatt->level();
        Serial.printf("Battery level: %d%% (%dmV) - ", pBatt->level(), pBatt->voltage());
        Serial.printf("Raw measure: %dmv\n", 2 * analogReadMilliVolts(BATT_HALFV_PIN));
        vTaskDelay(pdMS_TO_TICKS(5000));
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
