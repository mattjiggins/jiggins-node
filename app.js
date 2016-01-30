var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var marked = require('marked');

var exphbs  = require('express-handlebars');


//SETUP ROUTES
var routes = require('./routes/index');
var about = require('./routes/about');
var twitter = require('./routes/api-1-twitter');
var fivehundred = require('./routes/api-1-500px');

var app = express();

// view engine setup
var hbs = exphbs.create({
	helpers: {
		marked: function (data) { return marked(data); }
	}
});

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	partialsDir:'views/partials/',
}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API ROUTES

app.use('/api/1/twitter', twitter);
app.use('/api/1/500px', fivehundred);


// USE ROUTES
app.use('/', routes);
app.use('/about', about);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
