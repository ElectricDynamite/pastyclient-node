

var client = require('../lib/index.js').pastyclient('localhost', 8888);
      
client.getServerVersion(function(E,version) {
  if(E === null) {
    console.dir(version);
  } else {
    console.log("Error:");
    console.dir(E);
  }
});

