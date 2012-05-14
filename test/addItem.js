

var client = require('../lib/index.js').pastyclient('localhost', 8888);
var token = 'ee9ed55231cafe69660bc58717d9fb26b7da7fc8faab847cace3ff381e957e792d4d44fe5103262811bd8f0914666daa9a2325c45d3f9c436d74661c5ca2c636';

var item = "test234";

client.addItem(item, token, function(E,answer) {
  if(E === null) {
    console.dir(answer);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

