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

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * 
 * Implements Pasty API version 1
 */

var __version       = { "int": 7, "name": "0.1.0 master" };

var querystring     = require('querystring');
var http            = require('http');

PastyClient = function(target){
  this.Token = {};
  this.target = target;
  this.apiKey = target.api_key;
  };

PastyClient.prototype.getServerVersion = function(callback) {
  target        = this.target;
  target.path   = "/__version";
  var self      = this;
  PastyClient.prototype.HTTPGet(target, null, function(err, answer) {
    if(err == null) {
      callback(null, answer);
    } else {
      callback(err.error, null);
    }
  });
}

PastyClient.prototype.listItems = function(token, callback) {
  var authData = new Object();
  authData.token = token;
  target = this.target;
  target.path = "/v1/clipboard/list.json";
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(err, answer) {
    if(err == null) {
      if(answer.success==true) { // Success, we should have items
        callback(null, answer);
      } else { // No success, did not receive items
        callback(answer.error, null);
      }
    } else {
      callback(err.error, null);
    }
  });
};

PastyClient.prototype.getItem = function(id, token, callback) {
  var authData = new Object();
  authData.token = token;
  target = this.target;
  target.path = "/v1/clipboard/item/"+id;
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(err, answer) {
    if(err == null) {
      if(answer.success==true) { // Success, we should have the item
        callback(null, answer.item);
      } else { // No success, did not receive items
        callback(answer.error, null);
      }
    } else {
      callback(err.error, null);
    }      
  });
};

PastyClient.prototype.deleteItem = function(id, token, callback) {
  var authData = new Object();
  authData.token = token;
  target = this.target;
  target.path = "/v1/clipboard/item/"+id;
  var self = this;
  PastyClient.prototype.HTTPDelete(target, authData, function(err, answer) {
    if(err == null) {
      if(answer.success==true) { // Success item deleted
        callback(null, answer);
      } else { 
        callback(answer, false);
      }
    } else {
      console.dir(err);
      callback(err, false);
    }      
  });
};

PastyClient.prototype.addItem = function(item, token, callback) {
    var authData = { 'token': token };
    var data = {
    "item": item }
  target = this.target;
  target.path = "/v1/clipboard/item/";
  var self = this;
  PastyClient.prototype.HTTPPost(target, authData, data, function(err, answer) {
    if(err == null) {
      if(answer.success==true) { // Success item added
        callback(null, answer);
      } else { 
        callback(answer, false);
      }
    } else {
      callback(err, false);
    }      
  });
};

PastyClient.prototype.requestToken = function(user, passwd, callback) {
  authData = new Object({'user': user, 'password': passwd });
  target = this.target;
  target.path = "/v1/user/token";
  var self = this;
  PastyClient.prototype.HTTPGet(target, authData, function(err, answer) {
    if(err == null) {
      if(answer.success == true) { // Success, we should have a token
        // answer.tokeninfo should be a token object
        self.Token = answer.tokeninfo;
        callback(null, answer.tokeninfo);
      } else { // No success, did not receive token
        callback(answer.error, null);
      }
    } else {
      callback(err.error, null);
    }
  });  
}

PastyClient.prototype.createUser = function(user, passwd, callback) {
  var data = {
    "user": user,
    "password": passwd,
    "api_key": this.apiKey }
  target = this.target;
  target.path = "/v1/user/"
  var self = this;
  PastyClient.prototype.HTTPPost(target, null, data, function(E, answer) {
    if(E == null) {
      if(answer.success == true) {
        callback(null, answer);
      } else {
        callback(answer.error, null);
      }
    } else {
      callback(E, null)
    }
  });
}

PastyClient.prototype.updateUserPassword = function(user, uid, currPasswd, newPasswd, callback) {
  var data = {
    "newPassword": newPasswd };
  var authData = {
    'user': user,
    'password': currPasswd };
  target = this.target;
  target.path = "/v1/user/"+uid;
  var self = this;
  PastyClient.prototype.HTTPPut(target, authData, data, function(E, answer) {
    if(E == null) {
      if(answer.success == true) {
        callback(null, answer);
      } else {
        callback(answer.error, null);
      }
    } else {
      callback(E, null)
    }
  });
}

PastyClient.prototype.deleteUser = function(user, passwd, uid, callback) {
  authData = new Object({'user': user, 'password': passwd });
  target = this.target;
  target.path = "/v1/user/"+uid
  var self = this;
  PastyClient.prototype.HTTPDelete(target, authData, function(E, answer) {
    if(E == null) {
      if(answer.success == true) {
        callback(null, answer);
      } else {
        callback(answer.error, null);
      }
    } else {
      callback(E, null)
    }
  });
}


PastyClient.prototype.HTTPGet = function(target, authData, callback) {
  var method = 'GET';
  var data = null;
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
}

PastyClient.prototype.HTTPPost = function(target, authData, data, callback) {
  var method = 'POST';
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
}

PastyClient.prototype.HTTPPut = function(target, authData, data, callback) {
  var method = 'PUT';
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
}

PastyClient.prototype.HTTPDelete = function(target, authData, callback) {
  var method = 'DELETE';
  var data = null;
  PastyClient.prototype.HTTPRequest(target, method, authData, data, callback);
}



PastyClient.prototype.HTTPRequest = function(target, method, authData, data, callback) {
  if(authData === null) authData = {};  
  
  if(method == "POST") {
    var postData = JSON.stringify(data);
    var options = {
      host: target.host,
      port: target.port,
      path: target.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'PastyClient '+__version.name+' ('+__version.int+') node.js '+process.version,
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
      path: target.path,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'PastyClient '+__version.name+' ('+__version.int+') node.js '+process.version,
        'X-Pasty-User': authData.user,
        'X-Pasty-Password': authData.password,
        'X-Pasty-Token': authData.token
      }
    };
  } else if (method == "GET") {
    var options = {
      host: target.host,
      port: target.port,
      path: target.path,
      method: 'GET',
      headers: {
        'User-Agent': 'PastyClient '+__version.name+' ('+__version.int+') node.js '+process.version,
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
      path: target.path,
      method: 'DELETE',
      headers: {
        'User-Agent': 'PastyClient '+__version.name+' ('+__version.int+') node.js '+process.version,
        'Content-Length': 0,
        'X-Pasty-User': authData.user,
        'X-Pasty-Password': authData.password,
        'X-Pasty-Token': authData.token
      }
    };
  }
    
    
  
  
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
        var E = new Object({ "success": false, "error": {"code": 500, "message": "Malformed answer."} });
        callback(E, null);
      }
    });
  });
  
  req.on('error', function (error) {
    switch (error.code) {
      case "ECONNREFUSED":
        var err = new Object({ "success": false, "error": {"code": 500, "message": "Remote server refused to talk to us. That is SO rude!"} });
        break;
      case "ECONNRESET":
        var err = new Object( {"success": false, "error": {"code": 500, "message": "Remote server hung up on us. That is SO rude!"} });
        break;
      default:
          console.dir(error);
          var err = new Object({ "success": false, "error": {"code": 500, "message": "Unknown error occured."} });
        break;
    }
    callback(err, null);
  });
  if(method === "POST" || method === "PUT") {
    req.write(postData);
  }
  req.end();
}

function pastyclient(host, port, apiKey) {
  var tgt = { "host": host, "port": port, "api_key": apiKey };
  var pcl = new PastyClient(tgt);
  return pcl;
}

module.exports.pastyclient = pastyclient;
