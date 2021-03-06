var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var index = require('./routes/index');
var api = require('./routes/api');
var mongoose = require('mongoose');
var config = require('config');
var cors = require('cors');
var dbOptions = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false
 };
 
if(process.env.IS_PROD){
  var dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.3vpif.mongodb.net:27017,cluster0-shard-00-01.3vpif.mongodb.net:27017,cluster0-shard-00-02.3vpif.mongodb.net:27017/${config.DBHost}?ssl=true&replicaSet=atlas-iuym3c-shard-0&authSource=admin&retryWrites=true&w=majority`;
} else {
  var dbUrl = `mongodb://localhost:27017/${config.DBHost}`;
}
//connect db
mongoose.connect(dbUrl, dbOptions , function(err, res){
  if(err)
    console.log('DB connection failed: '+err);
  else
    console.log('DB connection running: '+dbUrl);
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if(config.useLogger){
  app.use(logger('dev'));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

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
