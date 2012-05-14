

var client = require('../lib/index.js').pastyclient('localhost', 8888);
var token = 'ee9ed55231cafe69660bc58717d9fb26b7da7fc8faab847cace3ff381e957e792d4d44fe5103262811bd8f0914666daa9a2325c45d3f9c436d74661c5ca2c636';

client.listItems(token, function(E,items) {
  if(E === null) {
    console.dir(items);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

