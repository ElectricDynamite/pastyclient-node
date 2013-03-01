pastyclient-node
================

 Module to build your own [Pasty](http://www.pastyapp.org/) client.

 More information at http://www.pastyapp.org/  

![Pasty Logo](http://pastyapp.org/images/logo_with_cloud_20130228_256x256.png)

Installation
------------
### Installing npm (node package manager)  
`curl http://npmjs.org/install.sh | sh`  
### Installing pastyclient-node
`npm install pastyclient-node`
### Installing pastyclient-node globally
`[sudo] npm install -g pastyclient-node`


How to use
----------

 pastyclient-node is a small library that will handle the REST calls to the [Pasty REST API server](https://github.com/ElectricDynamite/pasty-server) for you.
 Currently it does not offer any option to store user credentials within the client library, so you need to store these within your application and provide
 them upon each REST call.  

 While pastyclient-node will take care of the REST calls, you should still be familiar with [Pasty's REST API](https://github.com/ElectricDynamite/pasty-server/wiki/REST-API).

### General
 You always need to create your pastyclient by requiring the module and calling the pastyclient factory `pastyclient()`:
```js
var client = require('pastyclient-node').pastyclient(
    'api.pastyapp.org'
  , 443
  , { "ssl": true });
``` 
 The factory takes three arguments. The first argument is the REST servers `hostname`, the second is the REST servers TCP `port`.  
 The third argument is an `options` object, that currently takes any of the following values:  
  * "ssl": A boolean indicating whether or not the server will talk SSL/TLS.
  * "apiKey": If you have an API key for the REST server (in order to create users) you can specify it here as a string.

 After receiving your configured client from the factory, you can start using it. Keep your Pasty login data at hand.

### Getting the user clipboard

```js
var client = require('pastyclient-node').pastyclient(
    'api.pastyapp.org'
  , 443
  , { "ssl": true });
var username = '<username>';
var password = '<password>';

// call the REST server for the users clipboard
client.listItems(username, password, function(E,items) {
  if(E === null) {  // if no error occured
    console.dir(items);  // dump the items to console
  } else {
    console.log("Error:");
    console.dir(E); // display any error
  }
});
``` 

### Adding an item to the user clipboard

```js
var client = require('pastyclient-node').pastyclient(
    'api.pastyapp.org'
  , 443
  , { "ssl": true });
var username = '<username>';
var password = '<password>';

var item = "what a pretty string this is";

// call the REST server to add the item
client.addItem(item, username, password, function(E, itemId) {
  if(E === null) {  // if no error occured
    console.log(itemId);  // dump the newly created items id to console
  } else {
    console.log("Error:");
    console.dir(E); // display any error
  }
});
``` 

### Deleting an item from the user clipboard

```js
var client = require('pastyclient-node').pastyclient(
    'api.pastyapp.org'
  , 443
  , { "ssl": true });
var username = '<username>';
var password = '<password>';

var itemId = "4fc660923120c0790e000002";

// call the REST server to delete the item with id <itemId>
client.deleteItem(itemId, username, password, function(E, success) {
  if(E === null) {  // if no error occured
    console.log(success);  // success will contain true
  } else {
    console.log("Error:");
    console.dir(E); // display any error
  }
});
```
### Requesting a user token
 Since the [Pasty REST API](https://github.com/ElectricDynamite/pasty-server/wiki/REST-API) 
 does currently not support OAuth, there is a miserable work around to keep from
 sending the users credentials over the Internet all the time, and that is user tokens.

 You can request a user token using the `requestToken()` function, and then use this
 token instead of username / password in future clipboard calls. To do that, you 
 simply replace the username and the password parameter with a single string parameter
 containing the token.

 Here is an example:
```js
var client = require('pastyclient-node').pastyclient(
    'api.pastyapp.org'
  , 443
  , { "ssl": true });
var username = '<username>';
var password = '<password>';

var item = "what a pretty string this is";

// call the REST server to request a user token
client.requestToken(username, password, function(E, tokenInfo) {
  if(E === null) {  // if no error occured
    console.dir(tokenInfo); // let's see how the token info looks
    
    // call the REST server to add the item
    client.addItem(item, tokenInfo.token, function(E, itemId) {
      if(E === null) {  // if no error occured
        console.log(itemId);  // dump the newly created items id to console
      } else {
        console.log("Error:");
        console.dir(E); // display any error
      }
    });
  } else {
    console.log("Error:");
    console.dir(E); // display any error
  }
});

``` 

### More
 There is more that you can do with the library and Pasty. Please have a look 
 into the source code, for the following function calls:

  * getServerVersion()
  * getItem()
  * getUser()
  * createUser()
  * updateUserPassword()
  * deleteUser()
  * checkTokenValidity()

 They are pretty straight forward and fairly documented.


Contact
-------
 Please direct your questions and suggestions to electricdynamite.apps@gmail.com


License
-------
    Copyright 2012 Philipp Geschke
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
