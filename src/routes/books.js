'use strict';

/**
 * Router Middleware for Books
 * Integrates with other middleware and uses `.get()` methods to check if a user is authorizes before getting the requested book information.
 * @module src/routes
 */
const express = require('express');
const router = express.Router();
const auth = require('../../src/auth/middleware.js');

router.get('/books', auth, handleGetAll);
router.get('/books/:id', auth,  handleGetOne);

// Route Handlers
/**
 * Function that gets all books for the books route
 * @function
 * @name handleGetAll
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 */
function handleGetAll(req, res, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick' },
      { title:'Little Women' },
      { title: 'Eloquent Javascript' },
    ],
  };
  res.status(200).json(books);
}
/**
 * Function that gets one book for the books/id route
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 */
function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;
