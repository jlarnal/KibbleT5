#ifndef WEBSERVER_HPP
#define WEBSERVER_HPP

#include <ESPAsyncWebServer.h>
#include <DNSServer.h>
#include "DeviceState.hpp"
#include "ConfigManager.hpp"
#include "RecipeProcessor.hpp"
#include "TankManager.hpp"
#include "EPaperDisplay.hpp"
#include <ArduinoJson.h>

/**
 * @file WebServer.hpp
 * @brief Manages WiFi connection (STA/AP mode) and the REST API.
 */

class WebServer {
public:
    WebServer(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager, 
              RecipeProcessor& recipeProcessor, TankManager& tankManager, EPaperDisplay& display);
    
    bool manageWiFiConnection();
    void startAPIServer();

private:
    AsyncWebServer _server;
    DNSServer _dnsServer;
    DeviceState& _deviceState;
    SemaphoreHandle_t& _mutex;
    ConfigManager& _configManager;
    RecipeProcessor& _recipeProcessor;
    TankManager& _tankManager;
    EPaperDisplay& _display;

    // To store the list of scanned networks
    std::vector<String> _scanned_ssids;
    // Buffer to hold the pre-rendered captive portal page
    char* _captive_portal_buffer;

    // --- WiFi Management ---
    void _scanWifiNetworks();
    void _startAPMode();
    void _handleCaptivePortal(AsyncWebServerRequest *request);
    void _handleWifiSave(AsyncWebServerRequest *request);

    // --- API Routes ---
    void _setupAPIRoutes();

    // --- API Handlers ---
    void _handleGetSystemInfo(AsyncWebServerRequest *request);
    void _handleGetSystemStatus(AsyncWebServerRequest *request);
    void _handleRestart(AsyncWebServerRequest *request);
    void _handleFactoryReset(AsyncWebServerRequest *request);
    void _handleGetTanks(AsyncWebServerRequest *request);
    void _handleUpdateTank(AsyncWebServerRequest *request, JsonDocument& doc);
    void _handleGetScale(AsyncWebServerRequest *request);
    void _handleTareScale(AsyncWebServerRequest *request);
    void _handleCalibrateScale(AsyncWebServerRequest *request, JsonDocument& doc);
    void _handleFeedImmediate(AsyncWebServerRequest *request, JsonDocument& doc);
    void _handleFeedRecipe(AsyncWebServerRequest *request, JsonDocument& doc);
    void _handleGetFeedingHistory(AsyncWebServerRequest *request);
    void _handleStopFeeding(AsyncWebServerRequest *request);
    void _handleGetRecipes(AsyncWebServerRequest *request);
    void _handleAddRecipe(AsyncWebServerRequest *request, JsonDocument& doc);
    void _handleUpdateRecipe(AsyncWebServerRequest *request, JsonDocument& doc);
    void _handleDeleteRecipe(AsyncWebServerRequest *request);
    void _handleNotFound(AsyncWebServerRequest *request);
    void _handleBody(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total, 
                     std::function<void(AsyncWebServerRequest*, JsonDocument&)> handler);
};

#endif // WEBSERVER_HPP
