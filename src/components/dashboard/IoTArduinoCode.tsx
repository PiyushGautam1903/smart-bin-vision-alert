
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function IoTArduinoCode() {
  return (
    <AccordionItem value="code-snippet">
      <AccordionTrigger>Arduino Code Reference</AccordionTrigger>
      <AccordionContent>
        <div className="bg-slate-800 text-slate-100 p-3 rounded-md text-xs overflow-auto max-h-60">
          <pre>{`// HC-SR04 Ultrasonic Sensor with ESP8266 WiFi Module
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server details (replace with your server URL)
const char* serverUrl = "https://your-api-endpoint.com/bin-level";

// Ultrasonic sensor pins
const int trigPin = D1;
const int echoPin = D2;

// Variables
long duration;
int distance;
int binHeight = 50; // in cm
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
    
    String payload = "{\\\"binLevel\\\":" + String(binLevel) + "}";
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println(response);
    }
    
    http.end();
  }
  
  delay(5000);
}`}</pre>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
