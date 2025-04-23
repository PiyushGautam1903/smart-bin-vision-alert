
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";

interface IoTConnectProps {
  onStatusChange: (isConnected: boolean) => void;
  onLevelChange: (level: number) => void;
}

export function IoTConnect({ onStatusChange, onLevelChange }: IoTConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [internalLevel, setInternalLevel] = useState(60);

  const connectToDevice = () => {
    setConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setConnecting(false);
      onStatusChange(true);
      toast({
        title: "IoT Device Connected",
        description: "Successfully connected to ultrasonic sensor.",
      });
    }, 1500);
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    onStatusChange(false);
    toast({
      title: "IoT Device Disconnected",
      description: "Connection to ultrasonic sensor terminated.",
    });
  };

  // Simulate sensor readings when connected
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isConnected) {
      interval = setInterval(() => {
        // Simulate natural bin filling behavior (slowly increasing with some randomness)
        const increase = Math.random() * 2;
        const newLevel = Math.min(100, internalLevel + increase);
        setInternalLevel(newLevel);
        onLevelChange(newLevel);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, onLevelChange, internalLevel]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>IoT Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={`block rounded-full h-3 w-3 ${isConnected ? "bg-eco-500" : "bg-muted-foreground"}`} />
              <span>Ultrasonic Sensor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected and sending data" : "Not connected"}
            </p>
          </div>
          <Button 
            onClick={isConnected ? disconnectDevice : connectToDevice}
            disabled={connecting}
            variant={isConnected ? "outline" : "default"}
          >
            {connecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="connection-info">
            <AccordionTrigger>Connection Information</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Device Type:</span>
                  <span>Ultrasonic HC-SR04</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Communication:</span>
                  <span>WiFi (ESP8266)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Location:</span>
                  <span>Building A, Floor 1</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Data Rate:</span>
                  <span>Every 5 seconds</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
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
  // Serial port for debugging
  Serial.begin(115200);
  
  // Initialize ultrasonic sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Connect to WiFi
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
  // Measure distance
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read echo
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate distance
  distance = duration * 0.034 / 2;
  
  // Calculate bin fill level (%)
  binLevel = 100 - ((distance * 100) / binHeight);
  
  // Ensure binLevel is within 0-100 range
  binLevel = constrain(binLevel, 0, 100);
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  Serial.print("Bin level: ");
  Serial.print(binLevel);
  Serial.println("%");
  
  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    // API endpoint
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    String payload = "{\\\"binLevel\\\":" + String(binLevel) + "}";
    
    // Send POST request
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
  
  // Wait for 5 seconds before next reading
  delay(5000);
}`}</pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="connection-instructions">
            <AccordionTrigger>Connection Instructions</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Connect the HC-SR04 ultrasonic sensor to your ESP8266</li>
                <li>Upload the Arduino code (shown in the code reference)</li>
                <li>Make sure to replace WiFi credentials and server URL</li>
                <li>Position the ultrasonic sensor at the top of the bin</li>
                <li>Power on the ESP8266</li>
                <li>Click "Connect" button to start receiving data</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
