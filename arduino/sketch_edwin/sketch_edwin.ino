#include <Servo.h>
#include <Process.h>
Process nodejs; // make a new Process for calling Node

//Process XYNAMEstring;
String XYString;

Servo servoX;
Servo servoY;
int posX;
int posY;
int laser = 4;
int LED = 5;


void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial

  pinMode(laser, OUTPUT);
  pinMode(LED, OUTPUT);

  int PositionX = 50;
  int PositionY = 50;

  servoX.attach(2);
  servoY.attach(3);

  nodejs.runShellCommandAsynchronously("node /mnt/sda1/yun/index.js");
  Serial.println("Started process");
}

void loop() {

  int sendData = 0;
  Servo currentServoX;
  Servo currentServoY;

  digitalWrite(laser, LOW);

  while (nodejs.available()) {
    digitalWrite(LED, HIGH);
    int inByte = nodejs.read();
    sendData = 0;
    switch (inByte) {
      case'O':     // Network Status
        digitalWrite(LED, HIGH);
        break;
      case'x':
        sendData = 1;
        Serial.println("CaseX");
        break;
      case 'y':
        sendData = 2;
        break;
      case 'U':    // User info Automove
        sendData = 3;
        break;
    }

   
    if (sendData == 1 ) {
      int PositionX = nodejs.parseInt();
        Serial.println(PositionX);
        delay(15);

        // map the result to a level from 0 to 180
        int PosX = map(PositionX, 1, 1000, 130, 60);

        servoX.write(PosX);

        delay(15);
        digitalWrite(laser, HIGH);
        delay(1500);
    }

    if (sendData == 2 ) {
      int PositionY = nodejs.parseInt();
      Serial.print(PositionY);
      delay(15);
       
      int PosY = map(PositionY, 0, 1000, 140, 40);
      servoY.write(PositionY);
      
      delay(15);
      digitalWrite(laser, HIGH);
      delay(1500);
    }

    if (sendData == 3 ) {


      Serial.println("Got U");
      String XYString = nodejs.readString();
      Serial.println("Got string");
      // find the colons:
      int firstColon = XYString.indexOf(":");
      int secondColon = XYString.lastIndexOf(":");

      String posXstring = XYString.substring(0, firstColon);
      String posYstring = XYString.substring(firstColon + 1);

      int PositionX = posXstring.toInt();
      int PositionY = posYstring.toInt();

      PositionX = map(PositionX, 0, 1000, 130, 60);
      PositionY = map(PositionY, 0, 1000, 140, 40);

      servoX.write(PositionX);
      servoY.write(PositionY);

      digitalWrite(LED, LOW);
      delay(100);
      digitalWrite(LED, HIGH);
      delay(100);
      digitalWrite(LED, LOW);

      digitalWrite(laser, HIGH);

      digitalWrite(LED, LOW);
      delay(100);
      digitalWrite(LED, HIGH);
      delay(100);
      digitalWrite(LED, LOW);
      delay(100);
      digitalWrite(LED, HIGH);

      Serial.print("PositionX:Y = ");
      Serial.print(PositionX);
      Serial.print(":");
      Serial.print(PositionY);

      delay(5000);
      digitalWrite(laser, LOW);
      delay(10);
    }
  }
}





