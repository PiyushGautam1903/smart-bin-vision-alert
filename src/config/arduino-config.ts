
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

export const ARDUINO_SERIAL_CODE = `
// Ultrasonic Sensor Direct USB Communication
const int trigPin = ${ARDUINO_CONFIG.SENSOR.TRIG_PIN};
const int echoPin = ${ARDUINO_CONFIG.SENSOR.ECHO_PIN};

void setup() {
  Serial.begin(${ARDUINO_CONFIG.SERIAL.BAUD_RATE});
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  int binLevel = 100 - ((distance * 100) / ${ARDUINO_CONFIG.SENSOR.BIN_HEIGHT});
  binLevel = constrain(binLevel, 0, 100);
  
  // Send data over serial
  Serial.print("LEVEL:");
  Serial.println(binLevel);
  
  delay(${ARDUINO_CONFIG.SENSOR.UPDATE_INTERVAL});
}
`;
