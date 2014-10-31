var x = 500;
var y = 500;
var request = new XMLHttpRequest();

function setPos(axis, value) {
  request.open("GET", '/position/' + axis + "/" + value, true);
  // close the request:
  request.send(null);
}

function up() {
  y += 20;
  check();
  console.log("y", y);
  setPos("y", y);
}

function left() {
  x -= 20;
  check();
  console.log("x", x);
  setPos("x", x);
}

function right() {
  x += 20;
  check();
  console.log("x", x);
  setPos("x", x);
}

function down() {
  y -= 20;
  check();
  console.log("y", y);
  setPos("y", y);
}

function check() {
  if (x < 0) x = 0;
  if (x > 1000) x = 1000;
  if (y < 0) y = 0;
  if (y > 1000) y = 1000;
}

function makeRecord() {
  var firstName = document.getElementById('firstNameSet').value;
  var lastName = document.getElementById('lastNameSet').value;
  request.open("GET", '/record/' + firstName + '/' + lastName + '/' + x + '/' + y, true);
  request.send(null);
}

function getRecord() {
  var firstName = document.getElementById('firstNameFind').value;
  var lastName = document.getElementById('lastNameFind').value;
  request.open("GET", '/record/' + firstName + '/' + lastName, true);
  request.send(null);
}