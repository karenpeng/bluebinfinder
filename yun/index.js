var WebSocket = require('faye-websocket');
var ws = new WebSocket.Client('ws://128.122.6.143:4000');
//var ws = new WebSocket.Client('ws://bluebinfinder.herokuapp.com');

ws.on('open', function (event) {
  console.log('O');
  ws.send('Hello, world!');
});

ws.on('message', function (event) {
  //console.log('message', event.data);
  var message = event.data;
  //console.log('received: %s', message);

  var subMessage = message.split('/');
  var test = parseInt(subMessage[0]);
  //isNaN()!!! haha never use this before, funny javascript>_<
  if (!isNaN(test)) {
    //moving the arm to get the bin
    //format number/number
    //console.log("format number/number");
    console.log('U' + subMessage[0] + ':' + subMessage[1]);
  } else {
    //moving the arm to set value
    //format: x/number
    //console.log("format axis/number");
    console.log(subMessage[0] + subMessage[1]);
  }
});

ws.on('close', function (event) {
  console.log('close', event.code, event.reason);
  ws = null;
});