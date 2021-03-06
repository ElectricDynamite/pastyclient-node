/*
 * This file is part of pastyclient-node
 * 
 * Copyright 2012-2013 Philipp Geschke
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
 * Implements Pasty API version 2.1
 */

var http            = require('http');

PastyClient = function(target){
  this.Token = {};
  this.target = target;
  this.apiKey = target.api_key;
  this.ssl = (target.ssl === true || target.ssl === false) ? target.ssl : false;
  if(this.ssl === true) https = require('https');
};

PastyClient.prototype.__version = "0.4.0-master";
PastyClient.prototype.APIVERSION = "2.1.0"

/* 
 * Query the configured REST server for its version.
 *
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {object} [payload] the server version in an object.
 * @return {null}
 * @api public
 */
PastyClient.prototype.getServerVersion = function(callback) {
  target        = this.target;
  target.uri   = "/server/version";
  this.HTTPGet(target, null, function(err, answer) {
    if(err === null) {
      var payload = answer.payload;
      callback(null, payload);
    } else {
      callback(err, null);
    }
  });
}


/* 
 * Query the configured REST server for the users clipboard.
 *
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {array} [items] an array containing the items.
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
  target.uri = "/clipboard/list.json";
  this.HTTPGet(target, authData, function(err, answer) {
    if(err === null) {
      if(answer.payload) { // Success, we should have items
        callback(null, answer.payload.items);
      } else { // No success, did not receive items
        var err = new Object();
        err.http_code = 500;
        err.message = "Did not receive items"
        callback(err, null);
      }
    } else {
      callback(err, null);
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
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {object} the actual received item.
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
  target.uri = "/clipboard/item/"+id;
  var self = this;
  this.HTTPGet(target, authData, function(err, answer) {
    if(err === null) {
      if(answer.payload) { // Success, we should have the item
        callback(null, answer.payload);
      } else { // No success, did not receive items
        callback(answer.error, null);
      }
    } else {
      callback(err, null);
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
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {bool} the success of the operation.
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
  target.uri = "/clipboard/item/"+id;
  this.HTTPDelete(target, authData, function(err, answer) {
    if(err === null) {
      if(answer.code === 200) { // Success item deleted
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(err, false);
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
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {int} [_id] the newly created items id.
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
  target.uri = "/clipboard/item";
  this.HTTPPost(target, authData, data, function(err, answer) {
    if(err === null) {
      if(answer.payload) { // Success item added
        callback(null, answer.payload._id);
      } else { 
        callback(answer.error, null);
      }
    } else {
      callback(err, false);
    }
  });
};


/* 
 * Query the configured REST for a Pasty User Token to temporarily replace the login credentials.
 *
 * @param {string} [user] The username for which to get a token.
 * @param {string} [passwd] The users password.
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {object} a Pasty Token Object
 * @return {null}
 * @api public
 */
PastyClient.prototype.requestToken = function(user, passwd, callback) {
  authData = new Object({'user': user, 'password': passwd });
  target = this.target;
  target.uri = "/user/token";
  var self = this;
  this.HTTPGet(target, authData, function(err, answer) {
    if(err === null) {
      if(answer.payload) { // Success, we should have a token
        // answer.payload should be a token object
        self.Token = answer.payload;
        callback(null, answer.payload);
      } else { // No success, did not receive token
        callback(answer.error, null);
      }
    } else {
      callback(err, null);
    }
  });
};


/* 
 * Query the configured REST to verify the validity of a user token.
 *
 * @param {string} [token] a Pasty User Token
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {int} [expires] if the token is valid, the Unix Time when it will expire.
 * @return {null}
 * @api public
 */
PastyClient.prototype.checkTokenValidity = function(token, callback) {
  authData = new Object({"token": token});
  target = this.target;
  target.uri = "/user/token/validity";
  var self = this;
  this.HTTPGet(target, authData, function(err, answer) {
    if(err === null) {
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
          err = {};
          err.http_code = 500;
          err.message = "An unknown error occured";
          callback(err,null);
        }
      }
    } else {
      callback(err, null);
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
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {bool} [success] whether or not the user was added.
 * @return {null}
 * @api public
 */
PastyClient.prototype.createUser = function(user, passwd, callback) {
  var data = {
    "user": user,
    "password": passwd,
    "api_key": this.apiKey }
  target = this.target;
  target.uri = "/user/";
  this.HTTPPost(target, null, data, function(err, answer) {
    if(err === null) {
      if(answer.code === 201) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(err, false);
    }
  });
};


/* 
 * Query the configured REST server to check if a given username is available
 *
 * @param {string} [username] The username to test.
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {object} [payload] containing username and availability.
 * @return {null}
 * @api public
 */
PastyClient.prototype.checkUsernameAvailable = function(username, callback) {
  target        = this.target;
  target.uri   = "/v2.1/server/user/available?username="+username;
  this.HTTPGet(target, null, function(err, answer) {
    if(err === null) {
      var payload = answer.payload;
      callback(null, payload);
    } else {
      callback(err, null);
    }
  });
}

/* 
 * Query the configured REST for user information.
 *
 * @param {string} [user] The Pasty user's name.
 * @param {string} [password] The Pasty user's password.
 * @param {string} [token] As alternative to username/password, a valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {object} [userInfo] the information aquired.
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
  target.uri = "/user";
  this.HTTPGet(target, authData, function(err, answer) {
    if(err === null) {
      if(answer.code === 200) {
        callback(null, answer.payload);
      } else {
        callback(answer.error, null);
      }
    } else {
      callback(err, null);
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
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {bool} the success of the operation
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
  target.uri = "/user/"+uid;
  this.HTTPPut(target, authData, data, function(err, answer) {
    if(err === null) {
      if(answer.code === 200) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(err, false)
    }
  });
};


/* 
 * Query the configured REST to delete a certain user.
 *
 * @param {string} [user] The username to delete.
 * @param {string} [passwd] The users current password.
 * @param {string} [uid] The users Object Id.
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {bool} the success of the operation.
 * @return {null}
 * @api public
 */
PastyClient.prototype.deleteUser = function(user, passwd, uid, callback) {
  authData = new Object({'user': user, 'password': passwd });
  target = this.target;
  target.uri = "/user/"+uid
  this.HTTPDelete(target, authData, function(err, answer) {
    if(err === null) {
      if(answer.code === 200) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(err, false)
    }
  });
};


/* 
 * Will send a HTTP GET request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [err] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPGet = function(target, authData, callback) {
  var method = 'GET';
  var data = null;
  this.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP POST request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {object} [data] An Object that represents JSON data to be send to the server.
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [err] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPPost = function(target, authData, data, callback) {
  var method = 'POST';
  this.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP PUT request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {object} [data] An Object that represents JSON data to be send to the server.
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [err] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPPut = function(target, authData, data, callback) {
  var method = 'PUT';
  this.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP DELETE request to the REST API server.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {function} [callback] Function that will be forwardet to PastyClient.HTTPRequest() and will
 *                              eventually receive {object} [err] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPDelete = function(target, authData, callback) {
  var method = 'DELETE';
  var data = null;
  this.HTTPRequest(target, method, authData, data, callback);
};


/* 
 * Will send a HTTP request to the REST API server and handle the response.
 *
 * @param {object} [target] An object containing information about the target to query.
 * @param {string} [method] The HTTP method to use (GET, POST, PUT, DELETE...).
 * @param {object} [authData] An object containing authentication data (user, passwd, token).
 * @param {object} [data] An Object that represents JSON data to be send to the server.
 * @param {function} [callback] Function that will receive {object} [err] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api private
 */
PastyClient.prototype.HTTPRequest = function(target, method, authData, data, callback) {
  var userAgent = 'pastyclient-node '+this.__version+' node.js '+process.version;
  if(authData === null) authData = {};
  if(authData.user) { // take the authdata and write it into an Basic Authentication object
    var bAuthData = "Basic " + new Buffer(authData.user + ":" + authData.password).toString("base64");
  }

  var options = {
    host: target.host,
    port: target.port,
    path: target.uri,
    headers: {
      'Accept-Version': this.APIVERSION,
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
      try { // try to parse JSON
        var answer = JSON.parse(data);
      } catch (e) {
        var err = {};
        err.http_code = 500;
        err.message = "No valid JSON received: "+data;
        callback(err, null);
        return;
      }
      if(code >= 200 && code <= 206) { // request was successful
        callback(null, answer);
      } else if (code >= 300 && code <= 307) { // server send redirect
        // we do not follow anything the server wants us to follow right now, since this should never be the case.
        // instead let's raise an error.
        var err = new Object();
        err.http_code = 500;
        err.message = "Redirects not supported by pastyclient-node"
        callback(err, null);
      } else if (code >= 400 && code <= 418) { // client error
        if(typeof(answer.error) == "object") {
          var err = answer.error;
        } else if(answer.code != undefined && answer.message != undefined) { // New RestError, temporary support both 
          var err = answer;
          err.http_code = code;
        } else {
          var err = new Object();
          err.http_code = code;
          err.message = "Resource not found";
        }
        callback(err, null);
      } else if (code >= 500 && code <= 505) { // server error
        if(typeof(answer.error) == "object") {
          var err = answer.error;
        } else {
          var err = new Object();
          err.http_code = code;
          err.message = "Internal Server Error";
        }
        callback(err, null);
      } else {
        // Not existant HTTP code. Raise error.
        var err = new Object();
        err.http_code = 500;
        err.message = "HTTP Status Code "+code+" is not supported by pastyclient-node"
        callback(err, null);
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
        var err = new Object({"http_code": 500, "message": "Remote server refused the connection. Please check settings"});
        break;
      case "ECONNRESET":
        var err = new Object({"http_code": 500, "message": "Connection to remote server was resetted. Please try again"});
        break;
      case "ETIMEDOUT":
        var err = new Object({"http_code": 500, "message": "Connection to remote server timed out. Please check settings"});
        break;
      default:
        if(error.toString().search("error:140770FC:SSL") !== -1) {
          var err = new Object({"http_code": 500, "message": "Seems like remote server does not speak SSL"});
        } else {
          var err = new Object({"http_code": 500, "message": "Unknown error occured"});
        }
        break;
    }
    callback(err, null);
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
