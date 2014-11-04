var express = require("express");
var app = express();
var ejs = require("ejs");
var WebSocket = require('faye-websocket');
var http = require('http');
var server = http.createServer();
var mongoose = require('mongoose');
var Record = require('./dbmodel.js');
var config = require("./config.json");

//you have to define an empty object first b/c otherwise you can't add key in it
//var records = {};

server.listen(process.env.PORT || 4000);

// Set up the view directory
app.set("views", __dirname);

// Set EJS as templating language WITH html as an extension)
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

mongoose.connect(config.key);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // yay!
  console.log('yay!');
});

app.get('/set', function (req, res) {
  res.render('set.html');
});

app.get('/find', function (req, res) {
  res.render('find.html');
});

app.get('/record/:firstname/:lastname/:xvalue/:yvalue', function (req, res) {
  //save it
  // var key = req.params.firstname + req.params.lastname;
  // console.log(key);
  // records.key = {
  //   'x': req.params.xvalue,
  //   'y': req.params.yvalue
  // };
  // console.log(records.key);
  // console.log("save data " + records.key);
  var record = new Record({
    'name': req.params.firstname.trim().toLowerCase() + req.params.lastname.trim().toLowerCase(),
    'x': req.params.xvalue,
    'y': req.params.yvalue
  });
  record.save(function (err) {
    if (err) return console.error(err);
  });
});

app.get('/position/:axis/:value', function (req, res) {
  //if (wsConnection) {
  console.log('from web client ' + req.params.axis + ' ' + req.params.value);
  if (sio !== null) {
    sio.send(req.params.axis + '/' + req.params.value);
  }
  //}
});

app.get('/record/:firstname/:lastname', function (req, res) {
  //if (wsConnection) {
  var key = req.params.firstname.trim().toLowerCase() + req.params.lastname.trim().toLowerCase();
  var query = {
    'name': key
  };
  var select = "x y";
  var option = {
    limit: 1,
    sort: {
      'name': 1
    }
  };
  Record.findOne(query, select, option, function (err, data) {
    if (err) {
      return console.error(err);
    }
    if (data !== null) {
      console.log("asking data from " + data);
      if (sio !== null) {
        sio.send(data.x + '/' + data.y);
      }
    }
  });
});

server.on('upgrade', function (request, socket, body) {
  if (WebSocket.isWebSocket(request)) {
    var ws = new WebSocket(request, socket, body);

    ws.on('message', function (event) {
      console.log('received from yun: ' + event.data);
      //ws.send(event.data);
    });

    ws.on('close', function (event) {
      console.log('close', event.code, event.reason);
      ws = null;
    });
  }
});

//TODO:make a task que