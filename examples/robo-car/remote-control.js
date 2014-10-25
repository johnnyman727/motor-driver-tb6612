var keypress = require('keypress');
var net = require('net');

// make `process.stdin` begin emitting "keypress" events
var busy = false;
var client = net.connect({port: 8124, host:"192.168.128.237"}, function() { //'connect' listener
  console.log('client connected');
  keypress(process.stdin);
  // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if (key && key.ctrl && key.name == 'c') {
      process.stdin.pause();
      process.exit(1);
    }
    else if (!busy) {

      switch(key.name) {
        case 'w':
          console.log('forward');
          break;
        case 's':
          console.log('back');
          break;
        case 'a':
          console.log('left');
          break;
        case 'd':
          console.log('right');
          break;
      }
      client.write(key.name);
      busy = true;
    }

  });
});

client.on('data', function(data) {
  if (data.toString() == 'x') {
    busy = false;
  }
})

process.stdin.setRawMode(true);
process.stdin.resume();