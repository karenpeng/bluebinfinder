var express = require("express");
var app = express();
var ejs = require("ejs");
var server = require('http').createServer(app);
var WebSocketServer = require('ws').Server;
var socketServer = new WebSocketServer({
  server: server
});
var config = require("./config.json");

//you have to define an empty object first b/c otherwise you can't add key in it
var records = {};

server.listen(4000);

// Set up the view directory
app.set("views", __dirname);

// Set EJS as templating language WITH html as an extension)
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/set', function (req, res) {
  res.render('set.html');
});

app.get('/find', function (req, res) {
  res.render('find.html');
});

app.get('/record/:firstname/:lastname/:xvalue/:yvalue', function (req, res) {
  //save it
  //TODO: hook up a database later
  var key = req.params.firstname + req.params.lastname;
  console.log(key);
  records.key = {
    'x': req.params.xvalue,
    'y': req.params.yvalue
  };
  console.log(records.key);
  console.log("save data " + records.key);
});

//var wsConnection = false;
// listen for new socket.io connections:
socketServer.on('connection', function (socket) {
  // send something to the web client with the data:
  //wsConnection = true;
  app.get('/position/:axis/:value', function (req, res) {
    //if (wsConnection) {
    console.log('from web client ' + req.params.axis + ' ' + req.params.value);
    socket.send(req.params.axis + '/' + req.params.value);
    //}
  });

  app.get('/record/:firstname/:lastname', function (req, res) {
    //if (wsConnection) {
    var key = req.params.firstname + req.params.lastname;
    if (records.key !== undefined) {
      console.log("asking data from " + records.key);
      socket.send(records.key.x + '/' + records.key.y);
    }
    //}
    //if you can't find it, show it on the web client

  });

  // if the client sends you data, act on it:
  socket.on('message', function (data) {
    console.log('received from yun: ' + data);
  });
});

//TODO:make a task que