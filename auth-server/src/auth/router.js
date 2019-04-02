'use strict';

/**
 * Router Middleware
 * Integrates with other middleware and uses `.post()` methods to authorize the user to signup and signin users attempting to access the /signin and /signup routes.
 * @module src/auth/router
 */

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
/**
 * @function
 * @name /signup
 * Accesses the users-model to generate a new User using the .post() method if the user does not exist and saves the new user to the database and returns a promise that contains a response object that contains the authorized user token and user data. Sends the response object to the cookie and the header.
 * @param  {object} res Express response object
 * @param  {function} next Express middleware next()
 * @param  {object} req.token Express request object
 */
authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});
/**
 * @function
 * @name /signin
 * Accesses the users-model to authenticate existing users using the .post() method.
 * @param  {object} res Express response object
 * @param  {function} next Express middleware next()
 * @param  {object} req.token Express request object
 */
authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;
