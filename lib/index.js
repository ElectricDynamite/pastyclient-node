/*
 * This file is part of pastyclient-node
 * 
 * Copyright 2012 Philipp Geschke
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * 
 * Implements Pasty API version 2
 */

var __version       = { "code": 17, "name": "0.3.0-master" };

var http            = require('http');

PastyClient = function(target){
  this.Token = {};
  this.target = target;
  this.apiKey = target.api_key;
  this.ssl = (target.ssl === true || target.ssl === false) ? target.ssl : false;
  if(this.ssl === true) https = require('https');
};


/* 
 * Query the configured REST server for its version.
 *
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} [payload] the server version in an object.
 * @return {null}
 * @api public
 */
PastyClient.prototype.getServerVersion = function(callback) {
  target        = this.target;
  target.uri   = "/v2/server/version";
  PastyClient.prototype.HTTPGet(target, null, function(E, answer) {
    if(E === null) {
      var payload = answer.payload;
      callback(null, payload);
    } else {
      callback(E, null);
    }
  });
}


/* 
 * Query the configured REST server for the users clipboard.
 *
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {array} [items] an array containing the items.
 * @return {null}
 * @api public
 */
PastyClient.prototype.listItems = function() {
  var authData = {};
  if(arguments.length >= 3) {
    authData.user = arguments[0];
    authData.password = arguments[1];
  } else {
    authData.token = arguments[0];
  }
  if(typeof(arguments[arguments.length-1]) !== "function") throw new Error("Last argument is not a callback function.");
  callback = arguments[arguments.length-1];
  target = this.target;
  target.uri = "/v2/clipboard/list.json";
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.payload) { // Success, we should have items
        callback(null, answer.payload.items);
      } else { // No success, did not receive items
        var E = new Object();
        E.code = 500;
        E.message = "Did not receive items"
        callback(E, null);
      }
    } else {
      callback(E, null);
    }
  });
};


/* 
 * Query the configured REST server for a certain clipboard item
 *
 * @param {string} [id] The Object Id of the clipboard item to get.
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} the actual received item.
 * @return {null}
 * @api public
 */
PastyClient.prototype.getItem = function() {
  var authData = {};
  if(arguments.length >= 4) {
    authData.user = arguments[1];
    authData.password = arguments[2];
  } else {
    authData.token = arguments[1];
  }
  var id = arguments[0] || undefined;
  if(typeof(arguments[arguments.length-1]) !== "function") throw new Error("Last argument is not a callback function.");
  callback = arguments[arguments.length-1];
  target = this.target;
  target.uri = "/v2/clipboard/item/"+id;
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.payload) { // Success, we should have the item
        callback(null, answer.payload);
      } else { // No success, did not receive items
        callback(answer.error, null);
      }
    } else {
      callback(E, null);
    }
  });
};


/* 
 * Query the configured REST server to delete a certain item
 *
 * @param {string} [id] The Object Id of the clipboard item to delete
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {bool} the success of the operation.
 * @return {null}
 * @api public
 */
PastyClient.prototype.deleteItem = function() {
  var authData = {};
  if(arguments.length >= 4) {
    authData.user = arguments[1];
    authData.password = arguments[2];
  } else {
    authData.token = arguments[1];
  }
  var id = arguments[0] || undefined;
  if(typeof(arguments[arguments.length-1]) !== "function") throw new Error("Last argument is not a callback function.");
  callback = arguments[arguments.length-1];
  target = this.target;
  target.uri = "/v2/clipboard/item/"+id;
  PastyClient.prototype.HTTPDelete(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.code === 200) { // Success item deleted
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      console.dir(E);
      callback(E, false);
    }
  });
};


/* 
 * Query the configured REST server to add acertain item
 *
 * @param {string} [item] The item to add to the clipboard.
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {int} [_id] the newly created items id.
 * @return {null}
 * @api public
 */
PastyClient.prototype.addItem = function() {
  var authData = {};
  if(arguments.length >= 4) {
    authData.user = arguments[1];
    authData.password = arguments[2];
  } else {
    authData.token = arguments[1];
  }
  var item = arguments[0] || undefined;
  if(typeof(arguments[arguments.length-1]) !== "function") throw new Error("Last argument is not a callback function.");
  callback = arguments[arguments.length-1];
   var data = {
    "item": item }
  target = this.target;
  target.uri = "/v2/clipboard/item/";
  PastyClient.prototype.HTTPPost(target, authData, data, function(E, answer) {
    if(E === null) {
      if(answer.payload) { // Success item added
        callback(null, answer.payload._id);
      } else { 
        callback(answer.error, null);
      }
    } else {
      callback(E, false);
    }
  });
};


/* 
 * Query the configured REST for a Pasty User Token to temporarily replace the login credentials.
 *
 * @param {string} [user] The username for which to get a token.
 * @param {string} [passwd] The users password.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} a Pasty Token Object
 * @return {null}
 * @api public
 */
PastyClient.prototype.requestToken = function(user, passwd, callback) {
  authData = new Object({'user': user, 'password': passwd });
  target = this.target;
  target.uri = "/v2/user/token";
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.payload) { // Success, we should have a token
        // answer.payload should be a token object
        self.Token = answer.payload;
        callback(null, answer.payload);
      } else { // No success, did not receive token
        callback(answer.error, null);
      }
    } else {
      callback(E, null);
    }
  });
};


/* 
 * Query the configured REST to verify the validity of a user token.
 *
 * @param {string} [token] a Pasty User Token
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {int} [expires] if the token is valid, the Unix Time when it will expire.
 * @return {null}
 * @api public
 */
PastyClient.prototype.checkTokenValidity = function(token, callback) {
  authData = new Object({"token": token});
  target = this.target;
  target.uri = "/v2/user/token/validity";
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.code === 200) { // payload should contain expire value
        if(answer.hasOwnProperty("payload")) {
          if(answer.payload.hasOwnProperty("expires")) {
            callback(null, answer.payload.expires);
            return;
          }
        }
        throw new Error("Server did not answer according to API");
      } else { 
        if(answer.hasOwnProperty(error)) {
          callback(answer.error, null);
        } else {
          throw new Error("Server did not answer accoring to API");
        }
      }
    } else {
      callback(E, null);
    }
  });
};


/* 
 * Query the configured REST to create a new user.
 *
 * This function requires a valid Pasty API Key upon creation of the client, which means that almost all
 * client implementation will and can never successfully call this.
 *
 * @param {string} [user] The username for the new user.
 * @param {string} [passwd] The new users password.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {bool} [success] whether or not the user was added.
 * @return {null}
 * @api public
 */
PastyClient.prototype.createUser = function(user, passwd, callback) {
  var data = {
    "user": user,
    "password": passwd,
    "api_key": this.apiKey }
  target = this.target;
  target.uri = "/v2/user/";
  PastyClient.prototype.HTTPPost(target, null, data, function(E, answer) {
    if(E === null) {
      if(answer.code === 201) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(E, false);
    }
  });
};


/* 
 * Query the configured REST for user information.
 *
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} [userInfo] the information aquired.
 * @return {null}
 * @api public
 */
PastyClient.prototype.getUser = function() {
  var authData = {};
  if(arguments.length >= 3) {
    authData.user = arguments[0];
    authData.password = arguments[1];
  } else {
    authData.token = arguments[0];
  }
  if(typeof(arguments[arguments.length-1]) !== "function") throw new Error("Last argument is not a callback function.");
  callback = arguments[arguments.length-1];
  target = this.target;
  target.uri = "/v2/user/";
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.code === 200) {
        callback(null, answer.payload);
      } else {
        callback(answer.error, null);
      }
    } else {
      callback(E, null);
    }
  });
};


/* 
 * Query the configured REST to update a users password.
 *
 * @param {string} [user] The username which will be updated.
 * @param {string} [uid] The users Object Id.
 * @param {string} [currPasswd] The users current password.
 * @param {string} [newPasswd] The users new password.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {bool} the success of the operation
 * @return {null}
 * @api public
 */
PastyClient.prototype.updateUserPassword = function(user, uid, currPasswd, newPasswd, callback) {
  var data = {
    "newPassword": newPasswd };
  var authData = {
    'user': user,
    'password': currPasswd };
  target = this.target;
  target.uri = "/v2/user/"+uid;
  PastyClient.prototype.HTTPPut(target, authData, data, function(E, answer) {
    if(E === null) {
      if(answer.code === 200) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(E, false)
    }
  });
};


/* 
 * Query the configured REST to delete a certain user.
 *
 * @param {string} [user] The username to delete.
 * @param {string} [passwd] The users current password.
 * @param {string} [uid] The users Object Id.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {bool} the success of the operation.
 * @return {null}
 * @api public
 */
PastyClient.prototype.deleteUser = function(user, passwd, uid, callback) {
  authData = new Object({'user': user, 'password': passwd });
  target = this.target;
  target.uri = "/v2/user/"+uid
  PastyClient.prototype.HTTPDelete(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.code === 200) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(E, false)
    }
  });
};


/* 
 * Will send a HTTP GET request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [E] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPGet = function(target, authData, callback) {
  var method = 'GET';
  var data = null;
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP POST request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {object} [data] An Object that represents JSON data to be send to the server.
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [E] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPPost = function(target, authData, data, callback) {
  var method = 'POST';
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP PUT request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {object} [data] An Object that represents JSON data to be send to the server.
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [E] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPPut = function(target, authData, data, callback) {
  var method = 'PUT';
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP DELETE request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [E] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPDelete = function(target, authData, callback) {
  var method = 'DELETE';
  var data = null;
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP request to the REST API server and handle the response.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {string} [method] The HTTP method to use (GET, POST, PUT, DELETE...).
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {object} [data] An Object that represents JSON data to be send to the server.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPRequest = function(target, method, authData, data, callback) {
  var userAgent = 'pastyclient-node '+__version.name+' ('+__version.code+') node.js '+process.version;
  if(authData === null) authData = {};
  if(authData.user && authData.password) { // take the authdata and write it into an Basic Authentication object
    var bAuthData = "Basic " + new Buffer(authData.user + ":" + authData.password).toString("base64");
  }

  var options = {
    host: target.host,
    port: target.port,
    path: target.uri,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': 0,
      'User-Agent': userAgent,
    }
  }

  if(bAuthData !== undefined) options.headers.Authorization = bAuthData;
  if(authData.token !== undefined && authData.token !== null) options.headers["X-Pasty-Token"] = authData.token;

  if(method == "POST") {
    var postData = JSON.stringify(data);
    options.method = 'POST';
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  } else if(method == "PUT") {
    var postData = JSON.stringify(data);
    options.method = 'PUT';
    options.headers['Content-Length'] =  Buffer.byteLength(postData);
  } else if (method == "GET") {
    options.method = 'GET';
    options.headers['Content-Length'] = 0;
  } else if (method == "DELETE") {
    options.method = 'DELETE';
    options.headers['Content-Length'] = 0;
  }

  /*
   * Send the HTTP Request and handle the response (res)
   */
  
  var resHandler = function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(chunk) {
      data+=chunk;
    });

    res.on('end', function() {
      
      // Get HTTP Statuscode and act according to situation
      var code = res.statusCode;
      
      if(code >= 200 && code <= 206) { // request was successful
        var answer = JSON.parse(data);
        callback(null, answer);
      } else if (code >= 300 && code <= 307) { // server send redirect
        // we do not follow anything the server wants us to follow right now, since this should never be the case.
        // instead let's raise an error.
        var E = new Object();
        E.http_code = 500;
        E.message = "Redirects not supported by pastyclient-node"
        callback(E, null);
      } else if (code >= 400 && code <= 417) { // client error
        var answer = JSON.parse(data);
        var E = answer.error;
        callback(E, null);        
      } else if (code >= 500 && code <= 505) { // server error
        var answer = JSON.parse(data);
        var E = answer.error;
        callback(E, null);     
      } else {
        // Not existant HTTP code. Raise error.
        var E = new Object();
        E.http_code = 500;
        E.message = "HTTP Status Code "+code+" is not supported by pastyclient-node"
        callback(E, null);
      }
    });
  }
  
  if(target.ssl === true) {
    var req = https.request(options, resHandler);  
  } else {
    var req = http.request(options, resHandler);
  }

  req.on('error', function (error) {
    switch (error.code) {
      case "ECONNREFUSED":
        var E = new Object({"code": 500, "message": "Remote server refused the connection. Please check settings."});
        break;
      case "ECONNRESET":
        var E = new Object({"code": 500, "message": "Connection to remote server was resetted. Please try again."});
        break;
      case "ETIMEDOUT":
        var E = new Object({"code": 500, "message": "Connection to remote server timed out. Please check settings."});
        break;
      default:
        if(error.toString().search("error:140770FC:SSL") !== -1) {
          var E = new Object({"code": 500, "message": "Seems like remote server does not speak SSL."});
        } else {
          var E = new Object({"code": 500, "message": "Unknown error occured."});
        }
        break;
    }
    callback(E, null);
  });
  if(method === "POST" || method === "PUT") { // if it is a POST or PUT request we will send a HTTP body
    req.write(postData);
  }
  req.end();
};

/*
 * PastyClient factory.
 *
 * @param {string} [host] The hostname of the Pasty REST API server.
 * @param {int} [port] The TCP port of the Pasty REST API server.
 * @param {string} [apiKey] A valid API key to allow user creation.
 * @return {object} A PastyClient object configured with the given parameters.
 * @api public
 */
function pastyclient(host, port, options) {
  options           = options || {};
  options.ssl       = options.ssl || false;
  options.apiKey    = options.apiKey || "";
  var tgt = { "host": host, "port": port, "ssl": options.ssl, "api_key": options.apiKey };
  var pcl = new PastyClient(tgt);
  return pcl;
};

module.exports.pastyclient = pastyclient;
