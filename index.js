var util = require('util');
var events = require('events');

function use(hardware, extraPin, callback) {
  return new MotorDriver(hardware, extraPin, callback)
}

function MotorDriver(hardware, extraPin, callback) {

  this.motors = new Array(2);

  this.motors[0] = new Motor(hardware.digital[3], hardware.digital[0], hardware.digital[1]);
  this.motors[1] = new Motor(hardware.digital[4], hardware.digital[5], extraPin);

  this.standby = hardware.digital[2].output(0);

  hardware.pwmFrequency(100);

  if (callback) {
    callback(null, this);
  }

  setImmediate(function() {
    this.emit('ready');
  }.bind(this));
}

util.inherits(MotorDriver, events.EventEmitter);

MotorDriver.prototype.drive = function(motorIndex, direction, speed) {

  var motor = this.motors[motorIndex];

  motor.drive(direction, speed);

  this.standby.output(1);

  setImmediate(function() {
    this.emit('drive', motorIndex, direction, speed);
  }.bind(this))
}

MotorDriver.prototype.forward = 1;
MotorDriver.prototype.backward = 0;

function Motor(pwm, forward, reverse) {
  this.pwm = pwm;
  this.forward = forward;
  this.reverse = reverse;
}

Motor.prototype.drive = function(direction, speed) {

  if (direction) {
    this.forward.output(1);
    this.reverse.output(0);
  }
  else {
    this.forward.output(0);
    this.reverse.output(1);
  }
  
  this.pwm.pwmDutyCycle(speed);
}

module.exports.use = use;
module.exports.MotorDriver = MotorDriver;
module.exports.Motor = Motor;