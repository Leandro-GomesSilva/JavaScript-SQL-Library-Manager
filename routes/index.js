var express = require('express');
var router = express.Router();

// Importing the Book model
const Book = require('../models/book')

/* GET home page. */
router.get('/', async (req, res, next) => { 
  const books = await Book.findAll();   // Storing all books from the Model into a variable
});

module.exports = router;
