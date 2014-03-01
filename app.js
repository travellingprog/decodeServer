
/**
 * Module dependencies.
 */

var express = require('express'),
    fuel = require('./controllers/fuel'),
    user = require('./controllers/user'),
    http = require('http'),
    path = require('path');

var app = express();

/**
 * Middleware
 */

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};


/**
 * Connect MongoDB
 */



 /**
 * Routes
 */

app.get('/users', user.list);

app.get('/fuel/all', fuel.getAllCars);
app.get('/fuel/cars', fuel.getCars);
app.get('/fuel/list', fuel.getList);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
