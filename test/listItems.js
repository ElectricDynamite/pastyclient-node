

var client = require('../lib/index.js').pastyclient('mario.blafaselblub.net', 8888);
var token = '';

client.listItems(token, function(E,items) {
  if(E === null) {
    console.dir(items);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

