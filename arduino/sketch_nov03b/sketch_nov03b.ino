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
  while (!Serial);
  // launch the echo.js script asynchronously:
  nodejs.runShellCommandAsynchronously("node /mnt/sda1/yun/index.js");
  Serial.println("Started process");
}
void loop() {
  // pass any bytes that come in from the serial port
  // to the running node process:
  if (Serial.available()) {
    if (nodejs.running()) {
      //nodejs.write(Serial.read());
    }
  }
  // pass any incoming bytes from the running node process
  // to the serial port:
  while (nodejs.available()) {
    //Serial.write(nodejs.read());
      int currentPin = 0;
    // if we get a valid byte, read analog ins:
    //if (Serial.available() > 0) {
      // get incoming byte:
      int inByte = nodejs.read();
      switch(inByte){
        case'x':
         currentPin = 3;
         break;
        case 'y':
         currentPin = 6;
         break;
      }
      
      if(currentPin != 0){
        int value = Serial.parseInt();
        Serial.println(currentPin);
        Serial.println(value);
        value = map(value, 0, 1000, 0, 255);
        analogWrite(currentPin, value);
      }
   // }
  }
}

