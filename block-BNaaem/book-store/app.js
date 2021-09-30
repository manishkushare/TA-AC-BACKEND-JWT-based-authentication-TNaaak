var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var v1BooksRouter = require('./routes/v1Books');
var v2BooksRouter = require('./routes/v2Books');
var v1CommentsRouter = require('./routes/v1Comments');
var v3BooksRouter = require('./routes/v3Books');
var v4BooksRouter = require('./routes/v4Books');
var v1UsersRouter = require('./routes/v1User');


mongoose.connect('mongodb://localhost/book-store-api', (err)=> {
  console.log(err? err: "Connected to database");
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/v1/books', v1BooksRouter);
app.use('/api/v2/books', v2BooksRouter);
app.use('/api/v1/comments', v1CommentsRouter);
app.use('/api/v3/books', v3BooksRouter);
app.use('/api/v4/books', v4BooksRouter);
app.use('/api/v1/users', v1UsersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
