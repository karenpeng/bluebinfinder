#include <Process.h>
Process nodejs; // make a new Process for calling Node

void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial
  pinMode(3, OUTPUT);   // digital sensor is on digital pin 2
  pinMode(6, OUTPUT);   // digital sensor is on digital pin 2
  analogWrite(3,500);
  analogWrite(6,500);
  // Wait until a Serial Monitor is connected.
//  while (!Serial);
  // launch the echo.js script asynchronously:
  nodejs.runShellCommandAsynchronously("node /mnt/sda1/yun/index.js");
  Serial.println("Started process");
}
void loop() {
  while (nodejs.available()) {
//    Serial.println(nodejs.read());
    int currentPin = 0;
    int inByte = nodejs.read();
    switch(inByte){
    case'x':
      Serial.println('x');
      currentPin = 3;
      break;
    case 'y':
      Serial.println('y');
      currentPin = 6;
      break;
    }
    if(currentPin != 0){
      int value = nodejs.parseInt();
      Serial.println(currentPin);
      Serial.println(value);
      value = map(value, 0, 1000, 0, 255);
      analogWrite(currentPin, value);
    }
  }
}



