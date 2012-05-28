pastyclient-node
================

 Module to build your own [Pasty](http://www.pastyapp.org/) client.

 More information at http://www.pastyapp.org/  

![Pasty Logo](http://pastyapp.org/images/Pasty_256x256.png)

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
**NOTE: THIS DOCUMENTATION USES VERSION 0.2.0 OF pastyclient-node WHICH WILL BE RELEASED IN A FEW DAYS! HENCE NOTHING OF THIS WILL WORK WITH THE MODULE YOU CAN OBTAIN VIA NPM!**

pastyclient-node is a small library that will handle the REST calls to the [Pasty REST API server](https://github.com/ElectricDynamite/pasty-server) for you.
Currently it does not offer any option to store user credentials withing the client library, so you need to store these within your application and provide
them upon each REST call.  

While pastyclient-node will take care of the REST calls, you should still be familiar with [Pasty's REST API](https://github.com/ElectricDynamite/pasty-server/wiki/REST-API).

### General
You always need to create your pastyclient by requiring the module and calling the pastyclient factory `pastyclient()`:
```js
var client = require('pastyclient-node').pastyclient('api.pastyapp.org', 4444, {
    "ssl": true });
``` 
The factory take three arguments. The first argument is the REST servers `hostname`, the second is the REST servers TCP `port`.
The third argument is an `options` object, that currently takes any of the following values:  
  * "ssl": A boolean indicating whether or not the server will talk SSL/TLS.
  * "apiKey": If you have an API key for the REST server (in order to create users) you can specify it here as a string.

After creating receiving your configured client from the factory, you can start using it. Keep your Pasty logindata at hand.

### Getting the user clipboard

```js
var client = require('pastyclient-node').pastyclient('api.pastyapp.org', 4444, {"ssl": true});
var username = 'test';
var password = 'test';

client.listItems(user, password, function(E,items) { // call the REST server for the users clipboard
  if(E === null) {  // if no error occured
    console.dir(items);  // dump the items to console
  } else {
    console.log("Error:");
    console.dir(E); // display any error
  }
});
``` 

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
