

var client = require('../lib/index.js').pastyclient('localhost', 8888);
var username = '';
var password = '';

client.getUser(username, password, function(E,answer) {
  if(E === null) {
    console.dir(answer);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

