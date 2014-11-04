var WebSocket = require('faye-websocket');
var ws = new WebSocket.Client('ws://128.122.6.143:4000');
//var ws = new WebSocket.Client('ws://bluebinfinder.herokuapp.com');

// var serialport = require("serialport");
// var SerialPort = require("serialport").SerialPort;
// var portName = process.argv[2];

// console.log("opening serial port: " + portName);
// var serialPort = new SerialPort(portName, {
//   baudrate: 9600,
//   parser: serialport.parsers.readline("\r\n")
// });

// //do handshake here
// var contactEstablish = false;
// serialPort.on('open', function () {
//   console.log('open');
//   serialPort.on('data', function (data) {
//     console.log('from arduino: ' + typeof data + ' ' + data);
//     if (data === 'A') {
//       console.log("yeah");
//       serialPort.write('A');
//       contactEstablish = true;
//     }
//   });
// });

ws.on('open', function (event) {
  //console.log('open');
  ws.send('Hello, world!');
});

ws.on('message', function (event) {
  //console.log('message', event.data);
  var message = event.data;
  console.log('received: %s', message);

  var subMessage = message.split('/');
  var test = parseInt(subMessage[0]);
  //isNaN()!!! haha never use this before, funny javascript>_<
  if (!isNaN(test)) {
    //moving the arm to get the bin
    //format number/number
    console.log("format number/number");
    console.log('U' + subMessage[0] + ':' + subMessage[1]);
    // if (contactEstablish) {
    //   serialPort.write('U' + subMessage[0] + ':' + subMessage[1]);
    // }
  } else {
    //moving the arm to set value
    //format: x/number
    console.log("format axis/number");
    console.log(subMessage[0] + subMessage[1]);
    // if (contactEstablish) {
    //   serialPort.write(subMessage[0] + subMessage[1]);
    // }
  }
});

ws.on('close', function (event) {
  console.log('close', event.code, event.reason);
  ws = null;
});