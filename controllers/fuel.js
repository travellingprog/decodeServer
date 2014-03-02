/*
 * Fuel Consumption Data
 */

var _ = require('lodash'),
    Car = require('mongoose').model('Car');

var queryParameters = {
  'key': 'String',
  'limit': 'Integer',
  'co2_min': 'Number',
  'co2_max': 'Number',
  'cylinders': 'Integer',
  'engine_min': 'Number',
  'engine_max': 'Number',
  'city_min': 'Number',
  'city_max': 'Number',
  'highway_min': 'Number',
  'highway_max': 'Number',
  'fuel_type': 'String',
  'manufacturer': 'String',
  'model': 'String',
  'transmission': 'String',
  'vehicle_class': 'String',
  'year': 'Integer',
  'year_min': 'Integer',
  'year_max': 'Integer'
};
var possQueryKeys = _.keys(queryParameters);

var listTypes = ['cylinders', 'manufacturer', 'model', 'transmission', 'year', 'vehicle_class'];


exports.getAllCars = function(req, res) {
  getAll(res, function(result) {
    res.json({success: true, 'result': result});
  });
};

function getAll (res, cb){
  Car.find({}, function(err, result) {
    if (err) {
      return res.json({success: false, 'result': err});
    }
    cb(result);
  });
};



exports.getCars = function(req, res) {
  req.params.limit = req.param('limit') || 25;
  var query = buildQuery(req, res);
  if (!query) return;
  runQuery(query, res, function(qResult) {
    res.json({success: true, result: qResult});
  });
};


exports.getList = function(req, res) {
  var key = req.param('key');
  if (!key || listTypes.indexOf(key) < 0) {
    return res.json({success: false, result: "Key missing or invalid key."});
  }

  var query = buildQuery(req, res);
  if (!query) return;
  runQuery(query, res, function(list) {
    list.sort(function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    res.json({success: true, result: list});
  });
};



function buildQuery (req, res) {
  var query = {};
  for (var i=0, l=possQueryKeys.length; i < l; i++) {
    var keyName = possQueryKeys[i];
    var value = req.param(keyName);
    if (!value && value !== 0) continue;

    if ( !valueIsValid(value, keyName) ) {
      res.json({success: false, result: 'value provided is not valid'});
      return false;
    }

    var type = queryParameters[keyName];
    if ( (type === 'Integer' || type === 'Number') && _.isString(value) ) {
      value = parseFloat(value);
    }

    query[keyName] = value;
  }

  return query;
}


function valueIsValid(value, keyName) {
  switch(queryParameters[keyName]) {
    case 'String':
      if ( _.isString(value) ) {
        return true;
      }
      else if ( _.isArray(value) && value.length > 0)  {
        for (var i=0, l=value.length; i < l; i++) {
          if (! _.isString(value[i])) {
            return false;
          }
        }
        return true;
      }
      else {
        return false;
      }
      break;

    case 'Integer':
      if (_.isString(value)) {
        var newValue = parseInt(value, 10);
        if (newValue != value) { return false; }
        value = newValue;
      }
      return ( _.isFinite(value) && value >= 0 && parseInt(value, 10) === value);

    case 'Number':
      if (_.isString(value)) {
        value = parseFloat(value);
      }
      return ( _.isFinite(value) && value >= 0);

    default:
      console.error("checkValueValidity: forgot to define type "+queryParameters[keyName]+"!!!!");
  }
}


var queryKeyToProperty = {
  'co2_min': 'co2_emissions',
  'co2_max': 'co2_emissions',
  'engine_min': 'engine_size',
  'engine_max': 'engine_size',
  'year_min': 'year',
  'year_max': 'year',
  'city_min': 'fuel_cons.city.metric',
  'city_max': 'fuel_cons.city.metric',
  'highway_min': 'fuel_cons.highway.metric',
  'highway_max': 'fuel_cons.highway.metric'
};


function runQuery (query, res, cb) {
  var queryKeys = _.keys(query);
  if (queryKeys.length === 0) {
    getAll(res, cb);
    return;
  }

  var cond = Car.find();

  for (var i=0, l=queryKeys.length; i < l; i++) {
    var key = queryKeys[i];
    switch (key) {
      case 'key':
        cond = cond.distinct(query[key]);
        break;

      case 'limit':
        cond = cond.limit(query[key]);
        break;

      case 'cylinders':
      case 'year':
        cond = cond.where(key, query[key]);
        break;

      case 'fuel_type':
      case 'manufacturer':
      case 'model':
      case 'transmission':
      case 'vehicle_class':
        cond = cond.where(key, query[key].toUpperCase());
        break;

      case 'co2_min':
      case 'engine_min':
      case 'year_min':
      case 'city_min':
      case 'highway_min':
        var prop = queryKeyToProperty[key];
        cond = cond.gte(prop, query[key]);
        break;

      case 'co2_max':
      case 'engine_max':
      case 'year_max':
      case 'city_max':
      case 'highway_max':
        var prop = queryKeyToProperty[key];
        cond = cond.lte(prop, query[key]);
        break;
    }
  }

  cond.exec(function (err, qResult) {
    if (err)  {
      res.json({success: false, result: err});
      return console.error('ERROR, Fuel: Problem running the query. ' + err);
    }
    cb(qResult);
  });
}

