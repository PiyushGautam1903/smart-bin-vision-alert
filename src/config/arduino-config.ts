
export const ARDUINO_CONFIG = {
  SENSOR: {
    TRIG_PIN: 2,  // Digital pin for trigger
    ECHO_PIN: 3,  // Digital pin for echo
    BIN_HEIGHT: 50, // in cm
    UPDATE_INTERVAL: 1000, // 1 second interval
  },
  SERIAL: {
    BAUD_RATE: 9600, // Standard baud rate for Arduino communication
    TIMEOUT: 1000,   // Serial read timeout
  }
};

// Arduino code for direct USB serial communication with ultrasonic sensor
export const ARDUINO_SERIAL_CODE = `
/*
  Ultrasonic Sensor - Serial Communication
  This code is designed for direct communication between an Arduino Uno
  and a computer via a USB serial connection. It utilizes an ultrasonic
  sensor to measure distance and reports the bin level percentage.
  No WiFi or external networking is used.
*/

const int trigPin = ${ARDUINO_CONFIG.SENSOR.TRIG_PIN}; // Trigger pin for the ultrasonic sensor
const int echoPin = ${ARDUINO_CONFIG.SENSOR.ECHO_PIN}; // Echo pin for the ultrasonic sensor
const int binHeight = ${ARDUINO_CONFIG.SENSOR.BIN_HEIGHT}; // Height of the bin in cm

void setup() {
  Serial.begin(${ARDUINO_CONFIG.SERIAL.BAUD_RATE}); // Initialize serial communication
  pinMode(trigPin, OUTPUT); // Set trigger pin as output
  pinMode(echoPin, INPUT); // Set echo pin as input
}

void loop() {
  // Trigger the ultrasonic sensor to emit a pulse
  digitalWrite(trigPin, LOW); // Ensure the trigger is low
  delayMicroseconds(2); // Short delay
  digitalWrite(trigPin, HIGH); // Send a high pulse
  delayMicroseconds(10); // Hold the pulse for 10 microseconds
  digitalWrite(trigPin, LOW); // Return the trigger to low

  // Measure the time for the echo pulse to return
  long duration = pulseIn(echoPin, HIGH); // Measure the high pulse width
  // Calculate the distance based on the speed of sound (0.034 cm/microsecond)
  int distance = duration * 0.034 / 2; // Distance in cm

  // Calculate the bin level percentage
  // 100% - (measured distance / total bin height) * 100%
  int binLevel = 100 - ((distance * 100) / binHeight);
  binLevel = constrain(binLevel, 0, 100); // Ensure bin level is between 0 and 100

  // Check for serial commands from the computer
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\\n'); // Read the command until a newline
    // You can add code here to process commands if needed
  }

  // Send the bin level data back to the computer via serial
  Serial.print("LEVEL:"); // Send a label
  Serial.println(binLevel); // Send the bin level and a newline character
  delay(${ARDUINO_CONFIG.SENSOR.UPDATE_INTERVAL}); // Wait for a specified interval
}
`;
