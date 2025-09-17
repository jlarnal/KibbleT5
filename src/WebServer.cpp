#include "WebServer.hpp"
#include "ArduinoJson.h"
#include "esp_log.h"
#include <WiFi.h>
#include <SPIFFS.h>
#include <ESPmDNS.h>
#include <Update.h>

static const char* TAG = "WebServer";

// --- Captive Portal HTML ---
const char* captivePortalHtml_Part1 = R"rawliteral(
<!DOCTYPE HTML><html><head>
<title>KibbleT5 WiFi Setup</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
  .container { max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  h2 { color: #333; }
  input, select { width: 100%; padding: 12px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  button { background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
  button:hover { background-color: #45a049; }
  .manual-input { display: none; }
</style>
<script>
function toggleManual() {
  var select = document.getElementById('ssid-select');
  var manual = document.getElementById('manual-group');
  if (select.value === '__manual__') {
    manual.style.display = 'block';
    document.getElementById('manual-ssid').required = true;
  } else {
    manual.style.display = 'none';
    document.getElementById('manual-ssid').required = false;
  }
}
</script>
</head><body>
<div class="container">
  <h2>KibbleT5 WiFi Setup</h2>
  <p>Connect this device to your home WiFi network.</p>
  <form action="/wifisave" method="post">
    <label for="ssid-select">WiFi Network</label>
    <select id="ssid-select" name="ssid" onchange="toggleManual()" required>
      <option value="">-- Select a network --</option>
)rawliteral";

const char* captivePortalHtml_Part2 = R"rawliteral(
      <option value="__manual__">Enter manually...</option>
    </select>
    <div id="manual-group" class="manual-input">
      <label for="manual-ssid">Network Name (SSID)</label>
      <input type="text" id="manual-ssid" name="manual_ssid" placeholder="Enter network name">
    </div>
    <label for="pass">Password (leave blank if none)</label>
    <input type="password" id="pass" name="pass" placeholder="Your WiFi password">
    <button type="submit">Save and Connect</button>
  </form>
</div>
</body></html>
)rawliteral";


static uint64_t strToU64(String str, size_t base = 10)
{
    if (base < 2 || base > 36)
        return 0; // invalid base

    uint64_t result = 0;
    bool neg        = false;
    size_t i        = 0;

    // Trim leading spaces
    while (i < str.length() && isspace(str[i]))
        i++;

    // Handle sign
    if (i < str.length() && (str[i] == '-' || str[i] == '+')) {
        neg = (str[i] == '-');
        i++;
    }

    for (; i < str.length(); i++) {
        char c = str[i];
        uint8_t digit;

        if (c >= '0' && c <= '9')
            digit = c - '0';
        else if (c >= 'A' && c <= 'Z')
            digit = c - 'A' + 10;
        else if (c >= 'a' && c <= 'z')
            digit = c - 'a' + 10;
        else
            break; // invalid char

        if (digit >= base)
            break; // digit not valid for base

        result = result * base + digit;
    }

    return neg ? (uint64_t)(-(int64_t)result) : result;
}


WebServer::WebServer(DeviceState& deviceState, SemaphoreHandle_t& mutex, ConfigManager& configManager, RecipeProcessor& recipeProcessor,
  TankManager& tankManager, EPaperDisplay& display)
    : _server(80),
      _deviceState(deviceState),
      _mutex(mutex),
      _configManager(configManager),
      _recipeProcessor(recipeProcessor),
      _tankManager(tankManager),
      _display(display),
      _captive_portal_buffer(nullptr)
{}

void WebServer::_scanWifiNetworks()
{
    ESP_LOGI(TAG, "Scanning for WiFi networks...");
    _scanned_ssids.clear();
    int n = WiFi.scanNetworks(false, true);
    if (n == 0) {
        ESP_LOGW(TAG, "No networks found");
    } else {
        ESP_LOGI(TAG, "%d networks found", n);
        for (int i = 0; i < n; ++i) {
            _scanned_ssids.push_back(WiFi.SSID(i));
        }
    }
}

bool WebServer::manageWiFiConnection()
{
    std::string ssid, password;
    bool credentialsLoaded = _configManager.loadWiFiCredentials(ssid, password);

    if (credentialsLoaded) {
        ESP_LOGI(TAG, "Found saved credentials for SSID: %s. Attempting to connect.", ssid.c_str());
        WiFi.begin(ssid.c_str(), password.c_str());

        int retries = 0;
        while (WiFi.status() != WL_CONNECTED) {
            vTaskDelay(pdMS_TO_TICKS(500));
            if (++retries > 20) {
                ESP_LOGW(TAG, "Failed to connect with saved credentials.");
                break;
            }
        }
    }

    if (WiFi.status() != WL_CONNECTED) {
        ESP_LOGI(TAG, "Could not connect to WiFi. Starting Access Point mode.");
        _scanWifiNetworks();
        _startAPMode();
        while (true) {
            _dnsServer.processNextRequest();
            vTaskDelay(pdMS_TO_TICKS(10));
        }
        return false;
    }

    ESP_LOGI(TAG, "WiFi Connected! IP Address: %s", WiFi.localIP().toString().c_str());
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        _deviceState.ipAddress    = WiFi.localIP();
        _deviceState.wifiStrength = WiFi.RSSI();
        xSemaphoreGive(_mutex);
    }

    // Set up mDNS responder
    ESP_LOGI(TAG, "Setting up mDNS responder...");
    std::string hostname;
    if (xSemaphoreTake(_mutex, portMAX_DELAY) == pdTRUE) {
        hostname = _deviceState.deviceName;
        xSemaphoreGive(_mutex);
    } else {
        hostname = "kibblet5"; // Fallback hostname
    }

    if (MDNS.begin(hostname.c_str())) {
        MDNS.addService("http", "tcp", 80);
        ESP_LOGI(TAG, "mDNS responder started. You can now connect to http://%s.local", hostname.c_str());
        _display.showStatus("Online!", (hostname + ".local").c_str());
    } else {
        ESP_LOGE(TAG, "Error setting up mDNS responder!");
        _display.showStatus("WiFi Connected", WiFi.localIP().toString().c_str());
    }

    vTaskDelay(pdMS_TO_TICKS(2000));
    return true;
}

void WebServer::_startAPMode()
{
    const char* ap_ssid = "KibbleT5-Setup";

    // Calculate buffer size
    size_t options_len          = 0;
    size_t option_format_length = strlen("      <option value=\"%s\">%s</option>\n") - 4;
    for (const auto& ssid : _scanned_ssids) {
        options_len += option_format_length + (ssid.length() * 2);
    }

    size_t total_len       = strlen(captivePortalHtml_Part1) + options_len + strlen(captivePortalHtml_Part2) + 1;
    _captive_portal_buffer = (char*)malloc(total_len);

    if (!_captive_portal_buffer) {
        ESP_LOGE(TAG, "Fatal: Failed to allocate memory for captive portal page! Halting.");
        while (true) {
            vTaskDelay(pdMS_TO_TICKS(1000));
        }
    }

    // Build HTML directly
    strcpy(_captive_portal_buffer, captivePortalHtml_Part1);
    char* pos = _captive_portal_buffer + strlen(captivePortalHtml_Part1);

    for (const auto& ssid : _scanned_ssids) {
        pos += sprintf(pos, "      <option value=\"%s\">%s</option>\n", ssid.c_str(), ssid.c_str());
    }

    strcpy(pos, captivePortalHtml_Part2);

    ESP_LOGI(TAG, "Captive portal page pre-rendered into buffer.");

    // Start AP and DNS
    ESP_LOGI(TAG, "Starting AP: %s", ap_ssid);
    WiFi.softAP(ap_ssid);
    IPAddress apIP = WiFi.softAPIP();
    ESP_LOGI(TAG, "AP IP address: %s", apIP.toString().c_str());

    _dnsServer.start(53, "*", apIP);

    _server.on("/wifisave", HTTP_POST, std::bind(&WebServer::_handleWifiSave, this, std::placeholders::_1));
    _server.on("/", HTTP_GET, std::bind(&WebServer::_handleCaptivePortal, this, std::placeholders::_1));
    _server.onNotFound(std::bind(&WebServer::_handleCaptivePortal, this, std::placeholders::_1));
    _server.begin();
    _display.showWifiSetup(ap_ssid);
}


void WebServer::_handleCaptivePortal(AsyncWebServerRequest* request)
{
    if (_captive_portal_buffer) {
        request->send(200, "text/html", _captive_portal_buffer);
    } else {
        ESP_LOGE(TAG, "Captive portal buffer is null!");
        request->send(500, "text/plain", "Internal Server Error");
    }
}

void WebServer::_handleWifiSave(AsyncWebServerRequest* request)
{
    if (request->hasParam("ssid", true)) {
        String ssid = request->getParam("ssid", true)->value();
        String pass = "";
        if (request->hasParam("pass", true)) {
            pass = request->getParam("pass", true)->value();
        }

        _configManager.saveWiFiCredentials(ssid.c_str(), pass.c_str());

        String response = "<html><body><h1>Credentials saved!</h1><p>The device will now restart and connect to your WiFi.</p></body></html>";
        request->send(200, "text/html", response);

        ESP_LOGI(TAG, "WiFi credentials received. Restarting in 3 seconds...");
        _display.showStatus("Credentials Saved", "Restarting...");
        vTaskDelay(pdMS_TO_TICKS(3000));
        ESP.restart();
    } else {
        request->send(400, "text/plain", "Bad Request: SSID is required");
    }
}


void WebServer::startAPIServer()
{
    _server.reset();
    _setupAPIRoutes();

    // Serve static files with Gzip support
    _server.on("/", HTTP_GET, [](AsyncWebServerRequest* request) {
        String path       = "/index.html";
        String pathWithGz = path + ".gz";
        if (SPIFFS.exists(pathWithGz)) {
            AsyncWebServerResponse* response = request->beginResponse(SPIFFS, pathWithGz, "text/html");
            response->addHeader("Content-Encoding", "gzip");
            request->send(response);
        } else {
            request->send(SPIFFS, path, "text/html");
        }
    });

    _server.on("/*", HTTP_GET, [](AsyncWebServerRequest* request) {
        String path        = request->url();
        String contentType = "text/plain";
        if (path.endsWith(".css"))
            contentType = "text/css";
        else if (path.endsWith(".js"))
            contentType = "application/javascript";
        else if (path.endsWith(".svg"))
            contentType = "image/svg+xml";

        String pathWithGz = path + ".gz";
        if (SPIFFS.exists(pathWithGz)) {
            AsyncWebServerResponse* response = request->beginResponse(SPIFFS, pathWithGz, contentType);
            response->addHeader("Content-Encoding", "gzip");
            request->send(response);
        } else if (SPIFFS.exists(path)) {
            request->send(SPIFFS, path, contentType);
        } else {
            request->send(404);
        }
    });

    _server.onNotFound(std::bind(&WebServer::_handleNotFound, this, std::placeholders::_1));
    _server.begin();
    ESP_LOGI(TAG, "API Web Server started.");
}

void WebServer::_setupAPIRoutes()
{
    // System Routes
    _server.on("/system/info", HTTP_GET, std::bind(&WebServer::_handleGetSystemInfo, this, std::placeholders::_1));
    _server.on("/system/status", HTTP_GET, std::bind(&WebServer::_handleGetSystemStatus, this, std::placeholders::_1));
    _server.on("/system/restart", HTTP_POST, std::bind(&WebServer::_handleRestart, this, std::placeholders::_1));
    _server.on("/system/factory-reset", HTTP_POST, std::bind(&WebServer::_handleFactoryReset, this, std::placeholders::_1));

    // Settings Routes
    _server.on("/settings", HTTP_GET, std::bind(&WebServer::_handleGetSettings, this, std::placeholders::_1));
    _server.on(
      "/settings", HTTP_PUT, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleUpdateSettings(req, doc); });
      });
    _server.on("/settings/export", HTTP_GET, std::bind(&WebServer::_handleExportSettings, this, std::placeholders::_1));

    // Tank Routes
    _server.on("/tanks", HTTP_GET, std::bind(&WebServer::_handleGetTanks, this, std::placeholders::_1));
    _server.on(
      "^/tanks/([0-9A-Fa-f]{16})$", HTTP_PUT, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleUpdateTank(req, doc); });
      });
    _server.on("^/tanks/([0-9A-Fa-f]{16})/history$", HTTP_GET, std::bind(&WebServer::_handleGetTankHistory, this, std::placeholders::_1));

    // Feeding Routes
    _server.on(
      "^/feed/immediate/([0-9A-Fa-f]{16})$", HTTP_POST, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleFeedImmediate(req, doc); });
      });
    _server.on(
      "^/feed/recipe/([0-9]+)$", HTTP_POST, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleFeedRecipe(req, doc); });
      });
    _server.on("/feeding/stop", HTTP_POST, std::bind(&WebServer::_handleStopFeeding, this, std::placeholders::_1));
    _server.on("/feeding/history", HTTP_GET, std::bind(&WebServer::_handleGetFeedingHistory, this, std::placeholders::_1));

    // Recipe Routes
    _server.on("/recipes", HTTP_GET, std::bind(&WebServer::_handleGetRecipes, this, std::placeholders::_1));
    _server.on(
      "/recipes", HTTP_POST, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleAddRecipe(req, doc); });
      });
    _server.on(
      "^/recipes/([0-9]+)$", HTTP_PUT, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleUpdateRecipe(req, doc); });
      });
    _server.on("^/recipes/([0-9]+)$", HTTP_DELETE, std::bind(&WebServer::_handleDeleteRecipe, this, std::placeholders::_1));

    // Scale Routes
    _server.on("/scale/current", HTTP_GET, std::bind(&WebServer::_handleGetScale, this, std::placeholders::_1));
    _server.on("/scale/tare", HTTP_POST, std::bind(&WebServer::_handleTareScale, this, std::placeholders::_1));
    _server.on(
      "/scale/calibrate", HTTP_POST, [this](AsyncWebServerRequest* r) {}, NULL,
      [this](AsyncWebServerRequest* r, uint8_t* d, size_t l, size_t i, size_t t) {
          _handleBody(r, d, l, i, t, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleCalibrateScale(req, doc); });
      });

    // Diagnostics & Logs
    _server.on("/diagnostics/sensors", HTTP_GET, std::bind(&WebServer::_handleGetSensorDiagnostics, this, std::placeholders::_1));
    _server.on("/diagnostics/servos", HTTP_GET, std::bind(&WebServer::_handleGetServoDiagnostics, this, std::placeholders::_1));
    _server.on("/network/info", HTTP_GET, std::bind(&WebServer::_handleGetNetworkInfo, this, std::placeholders::_1));
    _server.on("/logs/system", HTTP_GET, std::bind(&WebServer::_handleGetSystemLogs, this, std::placeholders::_1));
    _server.on("/logs/feeding", HTTP_GET, std::bind(&WebServer::_handleGetFeedingLogs, this, std::placeholders::_1));

    // OTA Update Route
    _server.on(
      "/update", HTTP_POST,
      [](AsyncWebServerRequest* request) {
          AsyncWebServerResponse* response = request->beginResponse(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
          response->addHeader("Connection", "close");
          request->send(response);
          ESP.restart();
      },
      std::bind(&WebServer::_onUpdate, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, std::placeholders::_4,
        std::placeholders::_5, std::placeholders::_6));
}

// --- System Handlers ---
void WebServer::_handleGetSystemInfo(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        doc["deviceName"]      = _deviceState.deviceName;
        doc["firmwareVersion"] = _deviceState.firmwareVersion;
        doc["buildDate"]       = _deviceState.buildDate;
        doc["uptime"]          = _deviceState.uptime_s;
        doc["freeHeap"]        = esp_get_free_heap_size();
        doc["wifiStrength"]    = _deviceState.wifiStrength;
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleGetSystemStatus(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        doc["operational"]   = _deviceState.operational;
        doc["lastError"]     = _deviceState.lastError;
        doc["safetyMode"]    = _deviceState.safetyModeEngaged;
        doc["feedingStatus"] = _deviceState.currentFeedingStatus;
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleRestart(AsyncWebServerRequest* request)
{
    request->send(200, "application/json", "{\"success\":true, \"message\":\"Restarting in 3 seconds\"}");
    vTaskDelay(pdMS_TO_TICKS(3000));
    ESP.restart();
}

void WebServer::_handleFactoryReset(AsyncWebServerRequest* request)
{
    _configManager.factoryReset();
    request->send(200, "application/json", "{\"success\":true, \"message\":\"Factory reset complete. Restarting in 3 seconds\"}");
    vTaskDelay(pdMS_TO_TICKS(3000));
    ESP.restart();
}

// --- Settings Handlers ---
void WebServer::_handleGetSettings(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        doc["deviceName"]   = _deviceState.deviceName;
        doc["timezone"]     = _configManager.loadTimezone();
        doc["wifiStrength"] = _deviceState.wifiStrength;
        doc["safetyMode"]   = _deviceState.safetyModeEngaged;
        // These are placeholders as they are not yet in DeviceState
        doc["autoRefillAlerts"]                = true;
        JsonObject feedingSettings             = doc["feedingSettings"].to<JsonObject>();
        feedingSettings["timeOfFirstServing"]  = "08:30";
        feedingSettings["minTimeBetweenFeeds"] = 300;
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleUpdateSettings(AsyncWebServerRequest* request, JsonDocument& doc)
{
    const char* deviceName = doc["deviceName"];
    const char* timezone   = doc["timezone"];

    if (deviceName) {
        if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
            _deviceState.deviceName = deviceName;
            xSemaphoreGive(_mutex);
        }
    }
    if (timezone) {
        _configManager.saveTimezone(timezone);
    }

    // Add logic for other settings as they are implemented

    request->send(200, "application/json", "{\"success\":true}");
}

void WebServer::_handleExportSettings(AsyncWebServerRequest* request)
{
    JsonDocument doc;

    // Settings
    JsonObject settings = doc["settings"].to<JsonObject>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        settings["deviceName"] = _deviceState.deviceName;
        xSemaphoreGive(_mutex);
    }
    settings["timezone"] = _configManager.loadTimezone();

    // Tanks
    JsonArray tanks = doc["tanks"].to<JsonArray>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& tank : _deviceState.connectedTanks) {
            JsonObject tankObj       = tanks.add<JsonObject>();
            tankObj["uid"]           = tank.uid;
            tankObj["name"]          = tank.name;
            tankObj["w_capacity_kg"] = tank.w_capacity_kg;
        }
        xSemaphoreGive(_mutex);
    }

    // Recipes
    JsonArray recipes = doc["recipes"].to<JsonArray>();
    for (const auto& recipe : _recipeProcessor.getRecipes()) {
        JsonObject recipeObj     = recipes.add<JsonObject>();
        recipeObj["id"]          = recipe.id;
        recipeObj["name"]        = recipe.name;
        recipeObj["dailyWeight"] = recipe.dailyWeight;
        recipeObj["servings"]    = recipe.servings;
    }

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}


// --- Tank Handlers ---
void WebServer::_handleGetTanks(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    JsonArray tanksArray = doc.to<JsonArray>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& tank : _deviceState.connectedTanks) {
            JsonObject tankObj         = tanksArray.add<JsonObject>();
            tankObj["uid"]             = tank.uid;
            tankObj["name"]            = tank.name;
            tankObj["busIndex"]         = tank.busIndex;
            tankObj["wcapacity"]       = tank.w_capacity_kg * 1000;
            tankObj["remainingWeight"] = tank.remaining_weight_kg * 1000;

            JsonObject calib = tankObj["calibration"].to<JsonObject>();
            calib["idlePwm"] = tank.servoIdlePwm;

            tankObj["lastDispensed"]  = 0;
            tankObj["totalDispensed"] = 0;
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}


void WebServer::_handleUpdateTank(AsyncWebServerRequest* request, JsonDocument& doc)
{
    // 1. Extract UID from the path and perform basic validation.
    String uidStr = request->pathArg(0);
    if (uidStr.isEmpty()) {
        request->send(400, "application/json", "{\"error\":\"Missing tank UID in request path\"}");
        return;
    }
    uint64_t uid = strToU64(uidStr, 16); // UID is hexadecimal

    // 2. Create a TankInfo object to hold the new data.
    // We must first read the existing data to have a complete object to modify.
    TankInfo tankToUpdate;
    tankToUpdate.uid = uid;

    if (!_tankManager.refreshTankInfo(tankToUpdate)) {
        request->send(404, "application/json", "{\"error\":\"Tank not found\"}");
        return;
    }

    // 3. Populate the TankInfo object from the JSON document.
    // The JSON might only contain a subset of fields, so we check for existence.
    if (!doc["name"].isNull()) {
        tankToUpdate.name = doc["name"].as<std::string>();
    }
    if (!doc["remainingWeight"].isNull()) {
        // The API uses grams. We need to set remaining_weight_kg to a value that,
        // when multiplied by 1E-3 in the buggy toTankData method, yields the correct gram value.
        // Therefore, we must multiply by 1000.
        tankToUpdate.remaining_weight_kg = doc["remainingWeight"].as<double>() * 1000.0;
    }
    if (!doc["capacityLiters"].isNull()) {
        tankToUpdate.capacityLiters = doc["capacityLiters"].as<double>();
    }
    if (!doc["kibbleDensity"].isNull()) {
        tankToUpdate.kibbleDensity = doc["kibbleDensity"].as<double>();
    }

    // Handle nested calibration object
    if (doc["calibration"].is<JsonObject>()) {
        JsonObject calib = doc["calibration"];
        if (!calib["idlePwm"].isNull()) {
            tankToUpdate.servoIdlePwm = calib["idlePwm"].as<uint16_t>();
        }
    }

    // 4. Commit the changes using the full-featured TankManager method.
    if (_tankManager.commitTankInfo(tankToUpdate)) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        // This could fail if the tank was disconnected between the check and the commit.
        request->send(500, "application/json", "{\"error\":\"Failed to write update to tank EEPROM\"}");
    }
}

void WebServer::_handleGetTankHistory(AsyncWebServerRequest* request)
{
    String tankUid = request->pathArg(0);
    JsonDocument doc;
    JsonArray historyArray = doc.to<JsonArray>();

    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& entry : _deviceState.feedingHistory) {
            // This is a simplified implementation. A real implementation would need to check
            // if the tank was part of the recipe or immediate feed.
            JsonObject entryObj    = historyArray.add<JsonObject>();
            entryObj["timestamp"]  = entry.timestamp;
            entryObj["amount"]     = entry.amount;
            entryObj["recipeId"]   = entry.recipeId;
            entryObj["recipeName"] = entry.description;
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}


// --- Feeding Handlers ---
void WebServer::_handleFeedImmediate(AsyncWebServerRequest* request, JsonDocument& doc)
{
    String tankUid            = request->pathArg(0);
    JsonVariant amountVariant = doc["amount"];

    if (amountVariant.isNull() || !amountVariant.is<float>() || amountVariant.as<float>() <= 0) {
        request->send(400, "application/json", "{\"error\":\"Invalid or missing amount\"}");
        return;
    }
    float amount = amountVariant.as<float>();

    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
        if (_deviceState.feedCommand.processed) {
            _deviceState.feedCommand.type        = FeedCommandType::IMMEDIATE;
            _deviceState.feedCommand.tankUid     = strToU64(tankUid);
            _deviceState.feedCommand.amountGrams = amount;
            _deviceState.feedCommand.processed   = false;
            request->send(202, "application/json", "{\"success\":true, \"message\":\"Immediate feed command accepted\"}");
        } else {
            request->send(429, "application/json", "{\"error\":\"Device busy\"}");
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
    }
}

void WebServer::_handleFeedRecipe(AsyncWebServerRequest* request, JsonDocument& doc)
{
    int recipeId = request->pathArg(0).toInt();
    int servings = doc["servings"] | 1; // Default to 1 serving if not provided

    if (recipeId <= 0) {
        request->send(400, "application/json", "{\"error\":\"Invalid recipeId\"}");
        return;
    }

    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
        if (_deviceState.feedCommand.processed) {
            _deviceState.feedCommand.type      = FeedCommandType::RECIPE;
            _deviceState.feedCommand.recipeId  = recipeId;
            _deviceState.feedCommand.servings  = servings;
            _deviceState.feedCommand.processed = false;
            request->send(202, "application/json", "{\"success\":true, \"message\":\"Recipe feed command accepted\"}");
        } else {
            request->send(429, "application/json", "{\"error\":\"Device busy\"}");
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
    }
}

void WebServer::_handleStopFeeding(AsyncWebServerRequest* request)
{
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
        _deviceState.feedCommand.type      = FeedCommandType::EMERGENCY_STOP;
        _deviceState.feedCommand.processed = false;
        request->send(202, "application/json", "{\"success\":true, \"message\":\"Stop command accepted\"}");
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
    }
}

void WebServer::_handleGetFeedingHistory(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    JsonArray historyArray = doc.to<JsonArray>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& entry : _deviceState.feedingHistory) {
            JsonObject entryObj   = historyArray.add<JsonObject>();
            entryObj["timestamp"] = entry.timestamp;
            entryObj["type"]      = entry.type;
            if (entry.recipeId != -1) {
                entryObj["recipeId"] = entry.recipeId;
            }
            entryObj["success"] = entry.success;
            entryObj["amount"]  = entry.amount;
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

// --- Scale Handlers ---
void WebServer::_handleGetScale(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        doc["rawValue"]  = _deviceState.currentRawValue;
        doc["weight"]    = _deviceState.currentWeight;
        doc["stable"]    = _deviceState.isWeightStable;
        doc["timestamp"] = _deviceState.currentTime;
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleTareScale(AsyncWebServerRequest* request)
{
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
        if (_deviceState.feedCommand.processed) {
            _deviceState.feedCommand.type      = FeedCommandType::TARE_SCALE;
            _deviceState.feedCommand.processed = false;
            request->send(202, "application/json", "{\"success\":true, \"message\":\"Tare command accepted\"}");
        } else {
            request->send(429, "application/json", "{\"error\":\"Device busy\"}");
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
    }
}

void WebServer::_handleCalibrateScale(AsyncWebServerRequest* request, JsonDocument& doc)
{
    if (doc["knownWeight"].isNull()) {
        request->send(400, "application/json", "{\"error\":\"Missing knownWeight\"}");
        return;
    }
    float knownWeight = doc["knownWeight"];
    float newFactor   = _recipeProcessor.getScale().calibrateWithKnownWeight(knownWeight);

    JsonDocument responseDoc;
    responseDoc["success"]              = true;
    responseDoc["newCalibrationFactor"] = newFactor;
    responseDoc["message"]              = "Scale calibrated";

    String response;
    serializeJson(responseDoc, response);
    request->send(200, "application/json", response);
}

// --- Recipe Handlers ---
void WebServer::_handleGetRecipes(AsyncWebServerRequest* request)
{
    std::vector<Recipe> recipes = _recipeProcessor.getRecipes();
    JsonDocument doc;
    JsonArray recipesArray = doc.to<JsonArray>();
    for (const auto& recipe : recipes) {
        JsonObject recipeObj     = recipesArray.add<JsonObject>();
        recipeObj["id"]          = recipe.id;
        recipeObj["name"]        = recipe.name;
        recipeObj["dailyWeight"] = recipe.dailyWeight;
        recipeObj["servings"]    = recipe.servings;

        JsonArray ingredients = recipeObj["tanks"].to<JsonArray>();
        for (const auto& ing : recipe.ingredients) {
            JsonObject ingObj    = ingredients.add<JsonObject>();
            ingObj["tankUid"]    = ing.tankUid;
            ingObj["percentage"] = ing.percentage;
        }
        recipeObj["created"]  = recipe.created;
        recipeObj["lastUsed"] = recipe.lastUsed;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleAddRecipe(AsyncWebServerRequest* request, JsonDocument& doc)
{
    Recipe recipe;
    recipe.name = doc["name"].as<std::string>();
    if (recipe.name.empty()) {
        request->send(400, "application/json", "{\"error\":\"Recipe name is required\"}");
        return;
    }

    recipe.dailyWeight = doc["dailyWeight"];
    recipe.servings    = doc["servings"];

    JsonArray tanks    = doc["tanks"];
    float totalPercent = 0;
    for (JsonObject tank : tanks) {
        totalPercent += tank["percentage"].as<float>();
    }

    if (abs(totalPercent - 100.0) > 0.1) {
        request->send(400, "application/json", "{\"error\":\"Percentages must sum to 100\"}");
        return;
    }

    for (JsonObject tank : tanks) {
        RecipeIngredient ing;
        ing.tankUid    = tank["tankUid"].as<std::uint64_t>();
        ing.percentage = tank["percentage"].as<float>();
        recipe.ingredients.push_back(ing);
    }

    if (_recipeProcessor.addRecipe(recipe)) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        request->send(500, "application/json", "{\"error\":\"Failed to save recipe\"}");
    }
}

void WebServer::_handleUpdateRecipe(AsyncWebServerRequest* request, JsonDocument& doc)
{
    int recipeId = request->pathArg(0).toInt();
    if (recipeId <= 0) {
        request->send(400, "application/json", "{\"error\":\"Invalid recipeId\"}");
        return;
    }

    Recipe recipe;
    recipe.id   = recipeId;
    recipe.name = doc["name"].as<std::string>();
    if (recipe.name.empty()) {
        request->send(400, "application/json", "{\"error\":\"Recipe name is required\"}");
        return;
    }

    recipe.dailyWeight = doc["dailyWeight"];
    recipe.servings    = doc["servings"];

    JsonArray tanks    = doc["tanks"];
    float totalPercent = 0;
    for (JsonObject tank : tanks) {
        totalPercent += tank["percentage"].as<float>();
    }

    if (abs(totalPercent - 100.0) > 0.1) {
        request->send(400, "application/json", "{\"error\":\"Percentages must sum to 100\"}");
        return;
    }

    recipe.ingredients.clear();
    for (JsonObject tank : tanks) {
        RecipeIngredient ing;
        ing.tankUid    = tank["tankUid"].as<std::uint64_t>();
        ing.percentage = tank["percentage"].as<float>();
        recipe.ingredients.push_back(ing);
    }

    if (_recipeProcessor.updateRecipe(recipe)) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        request->send(404, "application/json", "{\"error\":\"Recipe not found\"}");
    }
}

void WebServer::_handleDeleteRecipe(AsyncWebServerRequest* request)
{
    int recipeId = request->pathArg(0).toInt();
    if (recipeId <= 0) {
        request->send(400, "application/json", "{\"error\":\"Invalid recipeId\"}");
        return;
    }

    if (_recipeProcessor.deleteRecipe(recipeId)) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        request->send(404, "application/json", "{\"error\":\"Recipe not found\"}");
    }
}

// --- Diagnostics & Logs Handlers ---
void WebServer::_handleGetSensorDiagnostics(AsyncWebServerRequest* request)
{
    JsonDocument doc;

    // Scale
    JsonObject scale = doc["scale"].to<JsonObject>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        scale["weight"]   = _deviceState.currentWeight;
        scale["rawValue"] = _deviceState.currentRawValue;
        scale["stable"]   = _deviceState.isWeightStable;
        xSemaphoreGive(_mutex);
    }

    // Tank Levels
    JsonArray tankLevels = doc["tankLevels"].to<JsonArray>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& tank : _deviceState.connectedTanks) {
            JsonObject tankLevel         = tankLevels.add<JsonObject>();
            tankLevel["uid"]             = tank.uid;
            tankLevel["remainingWeight"] = tank.remaining_weight_kg * 1000;
            tankLevel["sensorType"]      = "estimation";
        }
        xSemaphoreGive(_mutex);
    }

    // Placeholders for other sensors
    doc["temperature"] = 23.5;
    doc["humidity"]    = 45.2;

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleGetServoDiagnostics(AsyncWebServerRequest* request)
{
    // This is a placeholder implementation as servo positions are not tracked in state.
    JsonDocument doc;
    JsonArray tanks = doc["tanks"].to<JsonArray>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& tank : _deviceState.connectedTanks) {
            JsonObject tankDiag         = tanks.add<JsonObject>();
            tankDiag["uid"]             = tank.uid;
            tankDiag["connected"]       = tank.busIndex > -1;
            tankDiag["currentPosition"] = 1500; // Placeholder
        }
        xSemaphoreGive(_mutex);
    }

    JsonObject hopper         = doc["hopper"].to<JsonObject>();
    hopper["connected"]       = true;
    hopper["currentPosition"] = 1000; // Placeholder

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleGetNetworkInfo(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        doc["ssid"]           = WiFi.SSID();
        doc["ipAddress"]      = WiFi.localIP().toString();
        doc["macAddress"]     = WiFi.macAddress();
        doc["signalStrength"] = _deviceState.wifiStrength;
        doc["connected"]      = (WiFi.status() == WL_CONNECTED);
        doc["uptime"]         = _deviceState.uptime_s;
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
        return;
    }
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleGetSystemLogs(AsyncWebServerRequest* request)
{
    // This is a placeholder. A real implementation would require a logging buffer.
    JsonDocument doc;
    JsonArray logs        = doc.to<JsonArray>();
    JsonObject logEntry   = logs.add<JsonObject>();
    logEntry["timestamp"] = time(nullptr);
    logEntry["level"]     = "INFO";
    logEntry["message"]   = "Device started successfully";
    logEntry["component"] = "SYSTEM";

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void WebServer::_handleGetFeedingLogs(AsyncWebServerRequest* request)
{
    // This is an alias for /feeding/history
    _handleGetFeedingHistory(request);
}


// --- Utility Functions ---
void WebServer::_handleNotFound(AsyncWebServerRequest* request)
{
    // If the request is for an API endpoint, return 404 JSON. Otherwise, let the SPA handle it.
    if (request->url().startsWith("/api/")) {
        ESP_LOGW(TAG, "API Not found: http://%s%s", request->host().c_str(), request->url().c_str());
        request->send(404, "application/json", "{\"error\":\"Not found\"}");
    } else {
        // For any other path, serve the index.html. The Vue router will handle the client-side routing.
        String pathWithGz = "/index.html.gz";
        if (SPIFFS.exists(pathWithGz)) {
            AsyncWebServerResponse* response = request->beginResponse(SPIFFS, pathWithGz, "text/html");
            response->addHeader("Content-Encoding", "gzip");
            request->send(response);
        } else {
            request->send(SPIFFS, "/index.html", "text/html");
        }
    }
}

void WebServer::_onUpdate(AsyncWebServerRequest* request, String filename, size_t index, uint8_t* data, size_t len, bool final)
{
    if (index == 0) {
        ESP_LOGI(TAG, "Update Start: %s\n", filename.c_str());
        if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
            Update.printError(Serial);
        }
    }
    if (!Update.hasError()) {
        if (Update.write(data, len) != len) {
            Update.printError(Serial);
        }
    }
    if (final) {
        if (Update.end(true)) {
            ESP_LOGI(TAG, "Update Success: %u bytes\n", index + len);
        } else {
            Update.printError(Serial);
        }
    }
}

void WebServer::_handleBody(AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total,
  std::function<void(AsyncWebServerRequest*, JsonDocument&)> handler)
{
    if (index == 0) {
        request->_tempObject = malloc(total);
        if (!request->_tempObject) {
            request->send(500, "application/json", "{\"error\":\"Not enough memory\"}");
            return;
        }
    }

    if (request->_tempObject) {
        memcpy((char*)request->_tempObject + index, data, len);
    }

    if (index + len == total) {
        char* body = (char*)request->_tempObject;
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, body, total);
        free(request->_tempObject);
        request->_tempObject = nullptr;

        if (error) {
            request->send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
            return;
        }
        handler(request, doc);
    }
}
