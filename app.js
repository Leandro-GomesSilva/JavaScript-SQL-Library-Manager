var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');    // Modularizing the books-related routes

const db = require('./models/index');   // Importing the instance of 'sequelize' that was instantiated in the models/index.js file

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
app.use( '/static', express.static(path.join(__dirname, 'public')) );     // Defining a '/static' path for express.static (not specified in the instructions)

// Home route
app.use('/', indexRouter);

// Books Router (books-related routes)
app.use('/', booksRouter);


/******* ERROR HANDLERS *******/

// Handling 404 errors
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Page not found. Check details of the error on the screen.";

  console.log(err.message, "Error status:", err.status);    // Displaying error message and status on the console (not specified in the instructions)
  res.status(err.status);   // Setting the response status to the error status (not specified in the instructions)
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