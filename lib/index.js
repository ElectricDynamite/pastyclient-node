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
 * Implements Pasty API version 1
 */

var __version       = { "code": 11, "name": "0.1.0 master" };

var querystring     = require('querystring');
var http            = require('http');

PastyClient = function(target){
  this.Token = {};
  this.target = target;
  this.apiKey = target.api_key;
};


/* 
 * Query the configured REST server for its version.
 *
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} [answer] Pasty Answer Object
 * @return {null}
 * @api public
 */
PastyClient.prototype.getServerVersion = function(callback) {
  target        = this.target;
  target.uri   = "/__version";
  var self      = this;
  PastyClient.prototype.HTTPGet(target, null, function(E, answer) {
    if(E === null) {
      callback(null, answer);
    } else {
      callback(E, null);
    }
  });
}


/* 
 * Query the configured REST server for the users clipboard.
 *
 * @param {string} [token] A valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} [answer] Pasty Answer Object
 * @return {null}
 * @api public
 */
PastyClient.prototype.listItems = function(token, callback) {
  var authData = new Object();
  authData.token = token;
  target = this.target;
  target.uri = "/v1/clipboard/list.json";
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.success === true) { // Success, we should have items
        callback(null, answer.items);
      } else { // No success, did not receive items
        callback(answer.error, null);
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
 * @param {string} [token] A valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} the actual received item.
 * @return {null}
 * @api public
 */
PastyClient.prototype.getItem = function(id, token, callback) {
  var authData = new Object();
  authData.token = token;
  target = this.target;
  target.uri = "/v1/clipboard/item/"+id;
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.success === true) { // Success, we should have the item
        callback(null, answer.item);
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
 * @param {string} [token] A valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {bool} the success of the operation.
 * @return {null}
 * @api public
 */
PastyClient.prototype.deleteItem = function(id, token, callback) {
  var authData = new Object();
  authData.token = token;
  target = this.target;
  target.uri = "/v1/clipboard/item/"+id;
  var self = this;
  PastyClient.prototype.HTTPDelete(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.success === true) { // Success item deleted
        callback(null, true);
      } else { 
        callback(answer, false);
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
 * @param {string} [token] A valid Pasty User Token.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {bool} the success of the operation.
 * @return {null}
 * @api public
 */
PastyClient.prototype.addItem = function(item, token, callback) {
    var authData = { 'token': token };
    var data = {
    "item": item }
  target = this.target;
  target.uri = "/v1/clipboard/item/";
  var self = this;
  PastyClient.prototype.HTTPPost(target, authData, data, function(E, answer) {
    if(E === null) {
      if(answer.success === true) { // Success item added
        callback(null, true);
      } else { 
        callback(answer, false);
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
  target.uri = "/v1/user/token";
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.success === true) { // Success, we should have a token
        // answer.tokeninfo should be a token object
        self.Token = answer.tokeninfo;
        callback(null, answer.tokeninfo);
      } else { // No success, did not receive token
        callback(answer.error, null);
      }
    } else {
      callback(E, null);
    }
  });
}


/* 
 * Query the configured REST to create a new user.
 *
 * This function requires a valid Pasty API Key upon creation of the client, which means that almost all
 * client implementation will and can never successfully call this.
 *
 * @param {string} [user] The username for the new user.
 * @param {string} [passwd] The new users password.
 * @param {function} [callback] Function that will receive {object} [E] Error Object and {object} a Pasty Answer Object
 * @return {null}
 * @api public
 */
PastyClient.prototype.createUser = function(user, passwd, callback) {
  var data = {
    "user": user,
    "password": passwd,
    "api_key": this.apiKey }
  target = this.target;
  target.uri = "/v1/user/"
  var self = this;
  PastyClient.prototype.HTTPPost(target, null, data, function(E, answer) {
    if(E === null) {
      if(answer.success === true) {
        callback(null, answer);
      } else {
        callback(answer.error, null);
      }
    } else {
      callback(E, null)
    }
  });
}


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
  target.uri = "/v1/user/"+uid;
  var self = this;
  PastyClient.prototype.HTTPPut(target, authData, data, function(E, answer) {
    if(E === null) {
      if(answer.success === true) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(E, false)
    }
  });
}


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
  target.uri = "/v1/user/"+uid
  var self = this;
  PastyClient.prototype.HTTPDelete(target, authData, function(E, answer) {
    if(E === null) {
      if(answer.success === true) {
        callback(null, true);
      } else {
        callback(answer.error, false);
      }
    } else {
      callback(E, false)
    }
  });
}


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
}


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
}


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
}


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
}


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
  
  if(method == "POST") {
    var postData = JSON.stringify(data);
    var options = {
      host: target.host,
      port: target.port,
      path: target.uri,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': userAgent,
        'X-Pasty-User': authData.user,
        'X-Pasty-Password': authData.password,
        'X-Pasty-Token': authData.token
      }
    };
  } else if(method == "PUT") {
    var postData = JSON.stringify(data);
    var options = {
      host: target.host,
      port: target.port,
      path: target.uri,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': userAgent,
        'X-Pasty-User': authData.user,
        'X-Pasty-Password': authData.password,
        'X-Pasty-Token': authData.token
      }
    };
  } else if (method == "GET") {
    var options = {
      host: target.host,
      port: target.port,
      path: target.uri,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Content-Length': 0,
        'X-Pasty-User': authData.user,
        'X-Pasty-Password': authData.password,
        'X-Pasty-Token': authData.token
      }
    };
  } else if (method == "DELETE") {
    var options = {
      host: target.host,
      port: target.port,
      path: target.uri,
      method: 'DELETE',
      headers: {
        'User-Agent': userAgent,
        'Content-Length': 0,
        'X-Pasty-User': authData.user,
        'X-Pasty-Password': authData.password,
        'X-Pasty-Token': authData.token
      }
    };
  }

  /*
   * Send the HTTP Request and handle the response (res)
   */
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(chunk) {
      data+=chunk;
    });

    res.on('end', function() {
      try {
          var answer = JSON.parse(data);
          var throwiffail = answer.success;
          delete throwiffail;
          callback(null, answer);
      } catch (e) {
        console.dir(data);
        console.dir(e);
        var E = new Object({"code": 500, "message": "Malformed answer."});
        callback(E, null);
      }
    });
  });

  req.on('error', function (error) {
    switch (error.code) {
      case "ECONNREFUSED":
        var err = new Object({"code": 500, "message": "Remote server refused to talk to us. That is SO rude!"});
        break;
      case "ECONNRESET":
        var err = new Object({"code": 500, "message": "Remote server hung up on us. That is SO rude!"});
        break;
      default:
          console.dir(error);
          var err = new Object({"code": 500, "message": "Unknown error occured."});
        break;
    }
    callback(err, null);
  });
  if(method === "POST" || method === "PUT") {
    req.write(postData);
  }
  req.end();
}

/*
 * PastyClient factory.
 *
 * @param {string} [host] The hostname of the Pasty REST API server.
 * @param {int} [port] The TCP port of the Pasty REST API server.
 * @param {string} [apiKey] A valid API key to allow user creation.
 * @return {object} A PastyClient object configured with the given parameters.
 * @api public
 */
function pastyclient(host, port, apiKey) {
  var tgt = { "host": host, "port": port, "api_key": apiKey };
  var pcl = new PastyClient(tgt);
  return pcl;
}

module.exports.pastyclient = pastyclient;
