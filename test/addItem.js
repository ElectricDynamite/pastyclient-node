

var client = require('../lib/index.js').pastyclient('localhost', 8888);
var token = '';

var item = "test234";

client.addItem(item, token, function(E,answer) {
  if(E === null) {
    console.dir(answer);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

