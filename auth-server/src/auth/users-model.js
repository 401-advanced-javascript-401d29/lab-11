'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Schema that determines the required user inputs for username and password
 */
const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});
/**
 * A middleware function that converts the provided signup password into a hashed password
 * @function
 * @name users.pre()
 */
users.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});
/**
 * A function that takes in a username and password from _authBasic function and checks the database to see if it exists and then checks to see if the password matches. Returns user data if exists in the database
 * @function
 * @name authenticateBasic
 * @param  {object}
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(console.error);
};

// 
/**
 * A user method that compares a plain text password against the hashed one we have saved
 * @function
 * @name comparePassword
 * @param  {object} password
 * @param  {object} this.password
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

/**
 * Generate a JWT from the user id and a secret
 * @param  {object} this.id
 * @param  {string} process.env.SECRET||'changeit'
 */
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  return jwt.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);
