const express = require('express');
const router = express.Router();

const {Book} = require('../models/index');    // Importing the Book model

/***
 * `asyncHandler` function
 * Returns an Express-like async function with a try method, where a callback function passed as argument is "awaited" for, 
 * and a catch method where the error is forwarded to the global error handler.
 * 
 * @param {function} callback - The async function used to manipulate the database
 * @returns {function} The callback function for a generic Express get or post method
 * 
 */
function asyncHandler(callback) {
  return async(req, res, next) => {
    try {
      await callback(req, res, next)
    } catch(error) {
      next(error);    // Forwarding error to the global error handler
    }
  }
}


/******************************************************************************************************
 * 
 *      BOOK-RELATED ROUTES
 * 
 *****************************************************************************************************/

// Books List route
router.get('/books', asyncHandler( async (req, res) => {  
  console.log("Home Route called.");
  const books = await Book.findAll();   // Storing all books from the Model into a variable
  res.render('index', { books: books, title: "SQL Library Manager" });    // Rendering the template with the books list
}));

// Create New Book route
router.get('/books/new', (req, res) => {  
  console.log('Create New Book route called');
  res.render('new-book', {title: "New Book"});    // Rendering 'new-book' and passing the title to the pug template
});

// Post New Book route
router.post('/books/new', asyncHandler( async (req, res) => {  
  console.log('New Book POST route called. Redirecting to the Home route.');
  const book = await Book.create(req.body);   // Using Sequelize to create an entry in the database
  res.redirect('/books');
}));

// Update Book GET route
router.get('/books/:id', asyncHandler( async (req, res) => {  
  console.log('Update Book route called.');
  const book = await Book.findByPk(req.params.id);    // Selecting the book with the corresponding ID from the database
  res.render('update-book', { book: book });    // Rendering 'update-book' and passing the corresponding book entry from the database to the pug template
}));

// Update Book POST route
router.post('/books/:id', asyncHandler( async (req, res) => {  
  console.log('Update Book POST route called. Redirecting to the Home route.');
  const book = await Book.findByPk(req.params.id);    // Selecting the book with the corresponding ID from the database
  await book.update(req.body);    // Updating the book with the corresponding ID with the info passed from the form via the post method and the request body
  res.redirect('/books');
}));

// Delete Book route
router.post('/books/:id/delete', asyncHandler( async (req, res) => {  
  console.log('Delete Book POST route called. Redirecting to the Home route.');
  const book = await Book.findByPk(req.params.id);    // Selecting the book with the corresponding ID from the database
  await book.destroy();   // Deleting the book with the corresponding ID from the database
  res.redirect('/books');
}));

module.exports = router;