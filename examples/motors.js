var tessel = require('tessel');
var port = tessel.port['GPIO'];
var driverLib = require('../');
var md = driverLib.use(port, tessel.port['D'].digital[0]);

var speed = 0;
var direction = 0;

setInterval(function() {

  md.drive(0, direction, speed);
  md.drive(1, !direction, speed);

  if (speed >= 1.00) {
    direction = !direction;
    speed = 0;
  }
  else {
    speed += 0.10;
  }
}, 250);