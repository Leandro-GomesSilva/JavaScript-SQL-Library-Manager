const express = require('express');
const router = express.Router();

const {Op} = require('../models/index').Sequelize;    // Importing the Op object from Sequelize
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

/**************************************
/*          Books List route          *
/**************************************/
router.get('/books', asyncHandler( async (req, res) => {  
  console.log("Home Route called.");
  
  let books;
  let numberOfBooks;
  const search = req.query.search;
  const page = req.query.page;
  const booksPerPage = 10;

  if(!search && !page) {
    res.redirect('/books?page=1');
    return;
  } else if (!page) {
    res.redirect('/books?search=' + search + '&page=1');
    return;
  }

  // If there is a search query in the URL, this block runs
  if (search) {
    console.log("Performing search.");
    books = await Book.findAndCountAll({    // Storing books related to the Search Query into a variable
      where: {    // Using an OR operator, matching any substring in any attribute to the query string
        [Op.or]: [
          { title: {[Op.substring]: search.toLowerCase()} },
          { author: {[Op.substring]: search.toLowerCase()} },
          { genre: {[Op.substring]: search.toLowerCase()} },
          { year: {[Op.substring]: search.toLowerCase()} },
        ]
      },
      limit: booksPerPage,
      offset: (page - 1) * booksPerPage
    });
    numberOfBooks = books.count;    // After the await command above is done, the number of books is stored in this variable
    books = books.rows;   // The variable 'books' in then re-written with the actually book rows.
  }  else {
    books = await Book.findAll({ limit: booksPerPage, offset: (page - 1) * booksPerPage });     // In case the search query from the req object is empty, stores all books from the Model into a variable respecting limit and offset
    numberOfBooks = await Book.count();   // Counts the number of books in the database (without limit and offset)
  }  
  
  const numberOfPages = Math.ceil(numberOfBooks/booksPerPage);

  res.render('index', { title: "SQL Library Manager", books, search, numberOfPages });    // Rendering the template with the books list
}));


/**************************************
/*       Create New Book route        *
/**************************************/
router.get('/books/new', (req, res) => {  
  console.log('Create New Book route called');
  res.render('new-book', { title: "New Book", book: {} });    // Rendering 'new-book', passing the title to the pug template and passing an empty book object to render empty form fields in the template
});


/**************************************
/*        Post New Book route         *
/**************************************/
router.post('/books/new', asyncHandler( async (req, res) => {  
  let book;

  try {
    book = await Book.create(req.body);   // Using Sequelize to create an entry in the database
    console.log('New Book POST route called. Redirecting to the Home route.');
    res.redirect('/books');

  } catch (error) {

    if (error.name === "SequelizeValidationError") {    // In case a sequelize validation error is thrown, this if block will run
      book = await Book.build(req.body);    // Saving the previous entered form information into a variable
      res.render('new-book', { title: "New Book", book, validationErrors: error.errors })   // Re-rendering the 'new-book' and passing the previously entered book information and the error object to the template
    }
  }
}));


/**************************************
/*       Update Book GET-route        *
/**************************************/
router.get('/books/:id', asyncHandler( async (req, res) => {  
  console.log('Update Book route called.');
  const book = await Book.findByPk(req.params.id);    // Selecting the book with the corresponding ID from the database
  res.render('update-book', { book });    // Rendering 'update-book' and passing the corresponding book entry from the database to the pug template
}));


/**************************************
/*       Update Book POST-route       *
/**************************************/
router.post('/books/:id', asyncHandler( async (req, res) => {  
  let book;
  
  try {
    book = await Book.findByPk(req.params.id);    // Selecting the book with the corresponding ID from the database
    await book.update(req.body);    // Updating the book with the corresponding ID with the info passed from the form via the post method and the request body
    console.log('Update Book POST route called. Redirecting to the Home route.');
    res.redirect('/books');

  } catch (error) {

    if (error.name === "SequelizeValidationError") {    // In case a sequelize validation error is thrown, this if block will run
      book = await Book.build(req.body);    // Saving the previous entered form information into a variable
      book.id = req.params.id;    // Since the book id is not present in the request body, this line adds it as property to the book object
      res.render('update-book', { book, validationErrors: error.errors });    // Re-rendering the 'update-book' and passing the previously entered book information and the error object to the template
    }
  }
}));


/**************************************
/*         Delete Book route          *
/**************************************/
router.post('/books/:id/delete', asyncHandler( async (req, res) => {  
  console.log('Delete Book POST route called. Redirecting to the Home route.');
  const book = await Book.findByPk(req.params.id);    // Selecting the book with the corresponding ID from the database
  await book.destroy();   // Deleting the book with the corresponding ID from the database
  res.redirect('/books');
}));


module.exports = router;