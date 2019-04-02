'use strict';

/**
 * User Middleware
 * @module src/auth/middleware
 */

const User = require('./users-model.js');
/**
 * @function
 * Exports the authenticate functions and converts the password input into a hash
 */
module.exports = (req, res, next) => {
  /**
   * try/catch that takes in an authorization string from the command line and `splits()` the input on the space. Applying a switch case
   * @param  {regex} /\s+/ splits input on the whitespace
   */
  try {

    let [authType, authString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
    case 'basic':
      return _authBasic(authString);
    default:
      return _authError();
    }

  } catch(e) {
    return _authError();
  }
  /**
   * Manipulates and returns an object containing the user data to middleware.js
   * @function
   * @name _authBasic
   * @param  {string} authString
   * 
   */
  function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }
  /**
   * Adds token and user data to the request object and returns the object to router.js
   * @function
   * @name _authenticate
   * @param  {object} user
   * @param  {function} next
   */
  function _authenticate(user) {
    if ( user ) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }
  /**
   * Throws a 401 error if the username/password combination is invalid or not authorized
   * @param  {error message} next
   */
  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

