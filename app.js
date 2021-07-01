var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Importing the instance of 'sequelize' that was instantiated in the models/index.js file
const db = require('./models/index');

// Testing the connection to the database and synchronizing the model
(async () => {
  await db.sequelize.sync();
  
  try {
    await db.sequelize.authenticate();
    console.log('The connection to the database was successful!');    // Connection successful
  } catch (error) {
    console.error('An error occurred when connecting to the database: ', error);    // Connection not successful
  }
})();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/******* ROUTES *******/

// Home route
app.use('/', indexRouter);

// Books List route
app.get('/books', (req, res) => {  
  console.log("Route 'Books' called.");
  res.render('books', "");
});

// Create New Book Form route
app.get('/books/new', (req, res) => {  
  console.log("Route 'Create New Book Form' called.");
  res.render('new-book', {title: "New Book"});
});

// Post New Book route
app.post('/books/new', (req, res) => {  
  console.log("Route 'Post New Book' called.");
  res.render('books', "");
});

// Show Book Detail Form route
app.get('/books/:id', (req, res) => {  
  console.log(`Route 'Book ${id} Detail Form' called.`);
  res.render('update-book', {title: "A Brief History of Time"});
});

// Update Book Info route
app.post('/books/:id', (req, res) => {  
  console.log(`Route 'Book ${id} Info Update' called.`);
  res.render('books', "");
});

// Delete Book route
app.post('/books/:id/delete', (req, res) => {  
  console.log(`Route 'Delete Book ${id}' called.`);
  res.render('books', "");
});


/******* ERROR HANDLERS *******/

// Handling 404 errors
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Page not found. Check details of the error on the screen.";

  console.log(err.message, "Error status:", err.status);    // Displaying error message and status on the console, although it wasn't directly mentioned in the instructions
  res.status(err.status);   // Setting the response status to the error status, although it wasn't directly mentioned in the instructions
  res.render('page-not-found', {err, title: "Page not Found"});
  
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  
  if (err.status === 404) {
      return;
  } else {
      err.status = err.status || 500;
      err.message = err.message || "Server error. Check the Error Stack below for more details.";
      
      console.log("Error status:", err.status, err.message);
      res.status(err.status);   // Setting the response status to the error status, although it wasn't directly mentioned in the instructions
      res.render('error', {err});                    
  }
});

module.exports = app;
