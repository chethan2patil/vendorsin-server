var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var zlib = require("zlib");
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json({ limit: 2000000 }));
app.use(express.urlencoded({ limit: 2000000, extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/proxy', proxy('https://test-api.vendorsin.com', {
  userResDecorator: function (proxyRes, proxyResData) {
    return new Promise(function (resolve) {
      //var data = zlib.deflateSync(proxyResData).toString('base64');
      //setTimeout(function () {
        //resolve(data);
      //}, 1);
      resolve(proxyResData);
    });
  }
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
