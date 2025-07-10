#include "WebServer.hpp"
#include "ArduinoJson.h"
#include "esp_log.h"
#include <WiFi.h>
#include <SPIFFS.h>

static const char* TAG = "WebServer";

// Updated HTML constants
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

    _display.showStatus("WiFi Connected", WiFi.localIP().toString().c_str());
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
        options_len += option_format_length + (ssid.length() * 2); // <option value="ssid">ssid</option>\n
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
        // Serve the pre-rendered page from the buffer
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

    // Serve static files from SPIFFS first.
    // The third parameter ("/") indicates to serve from the root of the SPIFFS partition.
    // This will handle requests for /, /index.html, .js, .css, etc.
    _server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");

    // Then, set up the API routes.
    _setupAPIRoutes();

    // The onNotFound handler is set up inside _setupAPIRoutes,
    // which will catch any requests not handled by serveStatic or the API routes.

    _server.begin();
    ESP_LOGI(TAG, "API Web Server started.");
}


void WebServer::_setupAPIRoutes()
{
    _server.on("/system/info", HTTP_GET, std::bind(&WebServer::_handleGetSystemInfo, this, std::placeholders::_1));
    _server.on("/system/status", HTTP_GET, std::bind(&WebServer::_handleGetSystemStatus, this, std::placeholders::_1));
    _server.on("/system/restart", HTTP_POST, std::bind(&WebServer::_handleRestart, this, std::placeholders::_1));
    _server.on("/system/factory-reset", HTTP_POST, std::bind(&WebServer::_handleFactoryReset, this, std::placeholders::_1));
    _server.on("/tanks", HTTP_GET, std::bind(&WebServer::_handleGetTanks, this, std::placeholders::_1));
    _server.on(
      "/tanks/update", HTTP_POST, [](AsyncWebServerRequest* request) {}, NULL,
      [this](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
          _handleBody(request, data, len, index, total, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleUpdateTank(req, doc); });
      });
    _server.on("/scale", HTTP_GET, std::bind(&WebServer::_handleGetScale, this, std::placeholders::_1));
    _server.on("/scale/tare", HTTP_POST, std::bind(&WebServer::_handleTareScale, this, std::placeholders::_1));
    _server.on(
      "/scale/calibrate", HTTP_POST, [](AsyncWebServerRequest* request) {}, NULL,
      [this](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
          _handleBody(
            request, data, len, index, total, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleCalibrateScale(req, doc); });
      });
    _server.on("/feeding/history", HTTP_GET, std::bind(&WebServer::_handleGetFeedingHistory, this, std::placeholders::_1));
    _server.on("/feeding/stop", HTTP_POST, std::bind(&WebServer::_handleStopFeeding, this, std::placeholders::_1));
    _server.on(
      "/feeding/immediate", HTTP_POST, [](AsyncWebServerRequest* request) {}, NULL,
      [this](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
          _handleBody(
            request, data, len, index, total, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleFeedImmediate(req, doc); });
      });
    _server.on(
      "/feeding/recipe", HTTP_POST, [](AsyncWebServerRequest* request) {}, NULL,
      [this](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
          _handleBody(request, data, len, index, total, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleFeedRecipe(req, doc); });
      });
    _server.on("/recipes", HTTP_GET, std::bind(&WebServer::_handleGetRecipes, this, std::placeholders::_1));
    _server.on(
      "/recipes/add", HTTP_POST, [](AsyncWebServerRequest* request) {}, NULL,
      [this](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
          _handleBody(request, data, len, index, total, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleAddRecipe(req, doc); });
      });
    _server.on(
      "/recipes/update", HTTP_POST, [](AsyncWebServerRequest* request) {}, NULL,
      [this](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
          _handleBody(
            request, data, len, index, total, [this](AsyncWebServerRequest* req, JsonDocument& doc) { this->_handleUpdateRecipe(req, doc); });
      });
    _server.on("/recipes/delete", HTTP_POST, std::bind(&WebServer::_handleDeleteRecipe, this, std::placeholders::_1));
    _server.onNotFound(std::bind(&WebServer::_handleNotFound, this, std::placeholders::_1));
}

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

void WebServer::_handleGetTanks(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    JsonArray tanksArray = doc.to<JsonArray>();
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        for (const auto& tank : _deviceState.connectedTanks) {
            JsonObject tankObj       = tanksArray.add<JsonObject>();
            tankObj["uid"]           = tank.uid;
            tankObj["name"]          = tank.name;
            tankObj["kibbleDensity"] = tank.kibbleDensity;
            tankObj["level"]         = tank.level;
            tankObj["servoId"]       = tank.servoId;
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
    const char* uid  = doc["uid"];
    const char* name = doc["name"];
    if (!uid || !name) {
        request->send(400, "application/json", "{\"error\":\"Missing uid or name\"}");
        return;
    }

    bool success = _tankManager.setTankName(uid, name);
    if (success) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        request->send(500, "application/json", "{\"error\":\"EEPROM_WRITE_ERROR\"}");
    }
}


void WebServer::_handleGetScale(AsyncWebServerRequest* request)
{
    JsonDocument doc;
    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        doc["weight"] = _deviceState.currentWeight;
        doc["stable"] = _deviceState.isWeightStable;
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
            request->send(429, "application/json", "{\"error\":\"Device busy with another command\"}");
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
    }
}

void WebServer::_handleFeedImmediate(AsyncWebServerRequest* request, JsonDocument& doc)
{
    JsonVariant amountVariant = doc["amountGrams"];
    if (amountVariant.isNull() || !amountVariant.is<float>() || amountVariant.as<float>() <= 0) {
        request->send(400, "application/json", "{\"error\":\"Invalid or missing amountGrams\"}");
        return;
    }
    float amount = amountVariant.as<float>();

    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
        if (_deviceState.feedCommand.processed) {
            _deviceState.feedCommand.type        = FeedCommandType::IMMEDIATE;
            _deviceState.feedCommand.amountGrams = amount;
            _deviceState.feedCommand.processed   = false;
            request->send(202, "application/json", "{\"success\":true, \"message\":\"Immediate feed command accepted\"}");
        } else {
            request->send(429, "application/json", "{\"error\":\"Device busy with another command\"}");
        }
        xSemaphoreGive(_mutex);
    } else {
        request->send(503, "application/json", "{\"error\":\"Could not acquire state lock\"}");
    }
}

void WebServer::_handleFeedRecipe(AsyncWebServerRequest* request, JsonDocument& doc)
{
    JsonVariant idVariant = doc["recipeId"];
    if (idVariant.isNull() || !idVariant.is<int>()) {
        request->send(400, "application/json", "{\"error\":\"Missing or invalid recipeId\"}");
        return;
    }
    int id = idVariant.as<int>();

    if (xSemaphoreTake(_mutex, pdMS_TO_TICKS(1000)) == pdTRUE) {
        if (_deviceState.feedCommand.processed) {
            _deviceState.feedCommand.type      = FeedCommandType::RECIPE;
            _deviceState.feedCommand.recipeId  = id;
            _deviceState.feedCommand.processed = false;
            request->send(202, "application/json", "{\"success\":true, \"message\":\"Recipe feed command accepted\"}");
        } else {
            request->send(429, "application/json", "{\"error\":\"Device busy with another command\"}");
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

void WebServer::_handleGetRecipes(AsyncWebServerRequest* request)
{
    std::vector<Recipe> recipes = _recipeProcessor.getRecipes();
    JsonDocument doc;
    JsonArray recipesArray = doc.to<JsonArray>();
    for (const auto& recipe : recipes) {
        JsonObject recipeObj  = recipesArray.add<JsonObject>();
        recipeObj["id"]       = recipe.id;
        recipeObj["name"]     = recipe.name;
        JsonArray ingredients = recipeObj["ingredients"].to<JsonArray>();
        for (const auto& ing : recipe.ingredients) {
            JsonObject ingObj     = ingredients.add<JsonObject>();
            ingObj["tankUid"]     = ing.tankUid;
            ingObj["amountGrams"] = ing.amountGrams;
        }
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

    JsonArray ingredients = doc["ingredients"];
    for (JsonObject ingDoc : ingredients) {
        RecipeIngredient ing;
        ing.tankUid     = ingDoc["tankUid"].as<std::string>();
        ing.amountGrams = ingDoc["amountGrams"];
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
    Recipe recipe;
    recipe.id             = doc["id"];
    recipe.name           = doc["name"].as<std::string>();
    JsonArray ingredients = doc["ingredients"];
    for (JsonObject ingDoc : ingredients) {
        RecipeIngredient ing;
        ing.tankUid     = ingDoc["tankUid"].as<std::string>();
        ing.amountGrams = ingDoc["amountGrams"];
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
    if (!request->hasParam("id")) {
        request->send(400, "application/json", "{\"error\":\"Missing recipe id\"}");
        return;
    }
    int id = request->getParam("id")->value().toInt();
    if (_recipeProcessor.deleteRecipe(id)) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        request->send(404, "application/json", "{\"error\":\"Recipe not found\"}");
    }
}

void WebServer::_handleNotFound(AsyncWebServerRequest* request)
{
    ESP_LOGI(TAG, "URL target not found:`%s`", request->url().c_str());
    request->send(404, "text/plain", "Not found");
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

void WebServer::_handleCalibrateScale(AsyncWebServerRequest* request, JsonDocument& doc)
{
    request->send(501, "application/json", "{\"error\":\"Not Implemented\"}");
}
void WebServer::_handleGetFeedingHistory(AsyncWebServerRequest* request)
{
    request->send(501, "application/json", "{\"error\":\"Not Implemented\"}");
}
