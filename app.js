
/**
 * Module dependencies.
 */

var express = require('express'),
    fuel = require('./controllers/fuel'),
    user = require('./controllers/user'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    mongoose = require('mongoose');

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

function allowCrossDomain (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
}


/**
 * Connect MongoDB
 */

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

mongoose.connection.on('connected', function () {
  console.log('successful DB connection');
});


/**
 * Models
 */

require('./models/car');
require('./models/metadata');


/**
 * Get Data
 */

var importer = require('./controllers/importer');
function updateMetaData() {
  importer.checkForUpdate();
  setTimeout(updateMetaData, 24*60*60*1000);  // check for update once a day
}
updateMetaData();



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
