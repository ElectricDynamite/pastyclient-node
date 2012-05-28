

var client = require('../lib/index.js').pastyclient('localhost', 8888);
var token = '';

client.checkTokenValidity(token, function(E,answer) {
  if(E === null) {
    console.dir(answer);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

