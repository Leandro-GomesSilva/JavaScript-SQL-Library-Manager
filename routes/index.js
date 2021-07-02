var express = require('express');
var router = express.Router();

const {Book} = require('../models')   // Importing the Book model

/* GET home page. */
router.get('/', async (req, res, next) => { 
  console.log("Redirecting to '/books'");
  const books = await Book.findAll();   // Storing all books from the Model into a variable
  //res.json(books);  // Sending a JSON response
  res.redirect('/books');
});

module.exports = router;
