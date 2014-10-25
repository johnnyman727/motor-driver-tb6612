var net = require('net');
var driver = require('../');
var tessel = require('tessel');
var motorDriver = driver.use(tessel.port.GPIO, tessel.port.D.digital[0]);
var driveDuration = 500;
var busy = false;


setTimeout(function() {
  var server = net.createServer(function(connection) { //'connection' listener
    console.log('server connected');
    connection.on('data', function(direction) {
      if (busy) return;

      switch(direction.toString()) {
        case 'w' :
          driveForward();
          break;
        case 's' :
          driveBackward();
          break;
        case 'a' :
          leftTurn();
          break;
        case 'd':
          rightTurn();
          break;
      }
    });
    
    connection.on('end', function() {
      console.log('server disconnected');
    });

    function driveForward() {
      console.log('driving forward!');
      motorDriver.drive(0, 0, 255)
      motorDriver.drive(1, 1, 255);
      setTimeout(stop, driveDuration);
    }

    function driveBackward() {
      console.log('driving backward!');
      motorDriver.drive(0, 1, 255)
      motorDriver.drive(1, 0, 255);
      setTimeout(stop, driveDuration);
    }

    function rightTurn() {
      console.log('right turn!');
      motorDriver.drive(0, 1, 255)
      motorDriver.drive(1, 1, 255);
      setTimeout(stop, driveDuration);
    }

    function leftTurn() {
      console.log('left turn!');
      motorDriver.drive(0, 1, 255)
      motorDriver.drive(1, 1, 255);
      setTimeout(stop, driveDuration);
    }

    function stop() {
      motorDriver.drive(0, 0, 0);
      motorDriver.drive(1, 0, 0);
      // Signal that we're finished
      busy = false;
      connection.write('x');
    }

  });
  server.listen(8124, function() { //'listening' listener
    console.log('server bound');
  });
}, 10000);
