
export const ARDUINO_CONFIG = {
  // WiFi configuration
  WIFI: {
    SSID_PLACEHOLDER: "YOUR_WIFI_SSID",
    PASSWORD_PLACEHOLDER: "YOUR_WIFI_PASSWORD",
  },
  // Server configuration
  SERVER: {
    DEFAULT_URL: "https://your-api-endpoint.com/bin-level",
  },
  // Sensor configuration
  SENSOR: {
    TRIG_PIN: "D1",
    ECHO_PIN: "D2",
    BIN_HEIGHT: 50, // in cm
    UPDATE_INTERVAL: 5000, // 5 seconds
  },
};

export const ARDUINO_CODE = `// HC-SR04 Ultrasonic Sensor with ESP8266 WiFi Module
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi credentials
const char* ssid = "${ARDUINO_CONFIG.WIFI.SSID_PLACEHOLDER}";
const char* password = "${ARDUINO_CONFIG.WIFI.PASSWORD_PLACEHOLDER}";

// Server details (replace with your server URL)
const char* serverUrl = "${ARDUINO_CONFIG.SERVER.DEFAULT_URL}";

// Ultrasonic sensor pins
const int trigPin = ${ARDUINO_CONFIG.SENSOR.TRIG_PIN};
const int echoPin = ${ARDUINO_CONFIG.SENSOR.ECHO_PIN};

// Variables
long duration;
int distance;
int binHeight = ${ARDUINO_CONFIG.SENSOR.BIN_HEIGHT}; // in cm
int binLevel = 0;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  binLevel = 100 - ((distance * 100) / binHeight);
  binLevel = constrain(binLevel, 0, 100);
  
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    String payload = "{\\"binLevel\\":" + String(binLevel) + "}";
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println(response);
    }
    
    http.end();
  }
  
  delay(${ARDUINO_CONFIG.SENSOR.UPDATE_INTERVAL});
}`;
