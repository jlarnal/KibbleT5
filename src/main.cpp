#include <Arduino.h>
#include "esp_log.h"

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

// --- Global Objects ---
ConfigManager configManager("KibbleT5");
TimeKeeping timeKeeping(globalDeviceState, xDeviceStateMutex, configManager);
OneWire oneWire(ONE_WIRE_BUS);
OneWireEEPROM eepromController(&oneWire);
ServoController servoController;
TankManager tankManager(globalDeviceState, xDeviceStateMutex, &oneWire, &eepromController, &servoController);
HX711Scale scale(globalDeviceState, xDeviceStateMutex, configManager);
RecipeProcessor recipeProcessor(globalDeviceState, xDeviceStateMutex, configManager, tankManager, servoController, scale);
EPaperDisplay display(globalDeviceState, xDeviceStateMutex);
SafetySystem safetySystem(globalDeviceState, xDeviceStateMutex, servoController);
WebServer webServer(globalDeviceState, xDeviceStateMutex, configManager, recipeProcessor, tankManager, display);

static const char* TAG = "main";

// --- Prototypes for RTOS Tasks ---
void feedingTask(void* pvParameters);

void setup()
{
    Serial.begin(115200);
    vTaskDelay(pdMS_TO_TICKS(1000));
    ESP_LOGI(TAG, "--- KibbleT5 Starting Up ---");

    xDeviceStateMutex = xSemaphoreCreateMutex();
    if (xDeviceStateMutex == NULL) {
        ESP_LOGE(TAG, "Fatal: Could not create device state mutex.");
        return;
    }else{
        ESP_LOGI(TAG,"Device stater mutex instanciated.");        
    }

    if (!SPIFFS.begin()) {
        ESP_LOGE(TAG, "Fatal: Coult not initialize SPIFFS partition.");
        return;
    }else{
        ESP_LOGI(TAG,"SPIFFS partition mounted.");
    }

    configManager.begin();
    display.begin();
    display.showBootScreen();
    vTaskDelay(pdMS_TO_TICKS(2000));

    bool wifiConnected = webServer.manageWiFiConnection();

    if (wifiConnected) {
        webServer.startAPIServer();

        timeKeeping.begin();

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

        ESP_LOGI(TAG, "--- Setup Complete, System Operational ---");
    } else {
        ESP_LOGE(TAG, "Fatal: WiFi could not be configured. Halting.");
        display.showError("WiFi Failed", "Halting system.");
    }
}

void loop() { vTaskDelete(NULL); }

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
                    success = processor->executeImmediateFeed(command.amountGrams);
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
