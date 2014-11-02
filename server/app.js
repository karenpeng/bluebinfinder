var express = require("express");
var app = express();
var ejs = require("ejs");
var server = require('http').createServer(app);
var WebSocketServer = require('ws').Server;
var socketServer = new WebSocketServer({
  server: server
});
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
        socket.send(data.x + '/' + data.y);
      }
    });
  });

  // if the client sends you data, act on it:
  socket.on('message', function (data) {
    console.log('received from yun: ' + data);
  });
});

//TODO:make a task que