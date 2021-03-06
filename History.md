pastyclient-node history
========================


Current master
--------------
  * Fixed scope

Version 0.3.0
--------------
  * Switched to Pasty API version 2.1.0
  * Added support for /v2.1/server/user/available

Version 0.2.5
-------------
  * Fixed bug where error messages were not correctly interpreted and overwritten

Version 0.2.4
-------------
  * Fixed userAgent by moving the variable out of the constructor

Version 0.2.3
-------------
  * Fixed routes that had a trailing / but shouldn't have
  * Fixed handling of misbehaving server with 4xx and 5xx errors

Version 0.2.2
-------------
  * Bugfix: Removed console.dir() from deleteItem()

Version 0.2.1
-------------
  * Bugfix: APIv1 was still used in case of some errors

Version 0.2.0
-------------
  * Switched to API Version 2
  * Normalized API
  * Allowing the user of username/password instead of token
  * Supporting TLS now
  * Added checkTokenValidity()
  * Added getUser()
  * Optimized code

Version 0.1.0
-------------
  * Initial release. Implementing Pasty REST API Version 1
