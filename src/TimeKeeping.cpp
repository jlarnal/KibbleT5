#include "TimeKeeping.hpp"
#include "esp_log.h"
#include <WiFi.h>

static const char* TAG = "TimeKeeping";

TimeKeeping::TimeKeeping(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager)
    : _deviceState(deviceState), _mutex(mutex), _configManager(configManager) {}

void TimeKeeping::begin() {
    std::string tz = _configManager.loadTimezone();
    // Set the timezone environment variable. This is used by the underlying time functions.
    setenv("TZ", tz.c_str(), 1);
    tzset();
    
    // Start NTP synchronization
    // The first parameter is the primary NTP server, the second is the secondary.
    // The third parameter is the timezone string, but we set it via environment variable for wider compatibility.
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    ESP_LOGI(TAG, "NTP service configured. Timezone: %s", tz.c_str());
}

void TimeKeeping::startTask() {
    xTaskCreate(
        _timekeepingTask,
        "Timekeeping Task",
        4096,
        this,
        3, // Low priority task
        NULL
    );
}

void TimeKeeping::_timekeepingTask(void *pvParameters) {
    TimeKeeping* instance = (TimeKeeping*)pvParameters;
    ESP_LOGI(TAG, "Timekeeping Task started.");

    struct tm timeinfo;
    TickType_t lastNtpSync = 0;
    const TickType_t ntpSyncInterval = pdMS_TO_TICKS(3600000); // Sync every hour

    for (;;) {
        // Wait for WiFi to be connected before trying to get time
        if (WiFi.status() == WL_CONNECTED) {
            if (!getLocalTime(&timeinfo, 5000)) { // 5 second timeout
                ESP_LOGE(TAG, "Failed to obtain time from NTP server.");
            } else {
                // Time successfully obtained
                time_t now;
                time(&now);

                if (xSemaphoreTake(instance->_mutex, portMAX_DELAY) == pdTRUE) {
                    instance->_deviceState.currentTime = now;
                    strftime(instance->_deviceState.formattedTime, sizeof(instance->_deviceState.formattedTime), "%Y-%m-%d %H:%M:%S", &timeinfo);
                    instance->_deviceState.uptime_s = esp_timer_get_time() / 1000000;
                    xSemaphoreGive(instance->_mutex);
                }
            }
        }
        
        // This task updates the time every second, but only syncs with NTP periodically.
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
