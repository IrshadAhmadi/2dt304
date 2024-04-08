#include <WiFiLink.h>

// WiFi and server variables
char ssid[] = "IrshadIphone";
char password[] = "12345678";
const char* host = "172.20.10.3";
const int httpPort = 3000;
WiFiClient client;

// Pins for HC-SR04 Ultrasonic Sensor
const int trigPin = 9;
const int echoPin = 10;

// Pins for IR Sensors
const int irSensor1Pin = 3;
const int irSensor2Pin = 4;

// Variables for IR Sensors
int flag1 = 0;
int flag2 = 0;
unsigned long timer1 = 0;
unsigned long timer2 = 0;

// Variables for Ultrasonic Sensor
volatile unsigned long pulseStart = 0;
volatile unsigned long pulseEnd = 0;
volatile boolean pulseInProgress = false;
float distance;

// Speed Calculation
const float distanceBetweenSensors = 0.021; // in kilometers
float speed;

// Car Count and Categories
int carCount = 0;
const float sensorHeight = 187.0; // Height of the sensor from the ground in cm
const float truckHeight = 140; // Height threshold for trucks
const float suvHeight = 130; // Height threshold for SUVs
const float sedanHeight = 120; // Minimum height for sedans

// Car Presence Flag
bool carPresent = false;

void echoInterrupt() {
  if (digitalRead(echoPin) == HIGH) {
    pulseStart = micros();
    pulseInProgress = true;
  } else if (pulseInProgress) {
    pulseEnd = micros();
    pulseInProgress = false;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(echoPin), echoInterrupt, CHANGE);
  pinMode(irSensor1Pin, INPUT);
  pinMode(irSensor2Pin, INPUT);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected successfully!");
}

void loop() {
  // Trigger the ultrasonic pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  if (!pulseInProgress && pulseStart && pulseEnd) {
    unsigned long duration = pulseEnd - pulseStart;
    distance = (duration * 0.034) / 2;
    pulseStart = 0;
    pulseEnd = 0;
    // Print the distance from the sensor to the object detected
    Serial.print("Distance from sensor to object: ");
    Serial.print(distance);
    Serial.println(" cm");
  }
  // Calculate vehicle height
  float vehicleHeight = sensorHeight - distance;

  // Check if a vehicle is present based on height
  if (vehicleHeight > sedanHeight && !carPresent) {
    carPresent = true;
    carCount++; // Increment car count when a new car is detected
    String vehicleType;
    // Determine the vehicle type based on height
    if (vehicleHeight >= truckHeight) {
      vehicleType = "Truck";
    } else if (vehicleHeight >= suvHeight) {
      vehicleType = "SUV";
    } else {
      vehicleType = "Sedan";
    }

    // Send vehicle data when a car is present
    if (client.connect(host, httpPort)) {
      String jsonData = "{\"type\":\"" + vehicleType + "\", \"height\":" + String(vehicleHeight) + 
                  ", \"carCount\":" + String(carCount) + ", \"speed\":" + String(speed) + "}";
      client.println("POST /api/data HTTP/1.1");
      client.println("Host: " + String(host));
      client.println("Content-Type: application/json");
      client.println("Connection: close");
      client.print("Content-Length: ");
      client.println(jsonData.length());
      client.println();
      client.println(jsonData);
      
      Serial.println("Vehicle data sent: " + jsonData);
      client.stop(); // Close the connection after sending the data
    }
  } else if (vehicleHeight <= sedanHeight && carPresent) {
    carPresent = false; // Reset car presence flag when no car is detected
  }
  // IR Sensors for Speed Calculation
  if (flag1 == 1 && flag2 == 1 && carPresent) {
    float timeInSeconds = (timer2 - timer1) / 1000.0;
    speed = distanceBetweenSensors / timeInSeconds * 3600; // Speed in km/h
    Serial.print("Speed: ");
    Serial.print(speed);
    Serial.println(" km/h");
    flag1 = 0;
    flag2 = 0;
    // Here you can also send speed data to the server if needed
  }
  // Read IR sensors state
  int irSensor1Value = digitalRead(irSensor1Pin);
  int irSensor2Value = digitalRead(irSensor2Pin);

  // Detect vehicle passing by IR sensor 1
  if (irSensor1Value == LOW && flag1 == 0) {
    timer1 = millis();
    flag1 = 1;
  }
  // Detect vehicle passing by IR sensor 2 and calculate speed
  if (irSensor2Value == LOW && flag1 == 1 && flag2 == 0) {
    timer2 = millis();
    flag2 = 1;
  }

  delay(100); // Adjust delay based on your needs
}

