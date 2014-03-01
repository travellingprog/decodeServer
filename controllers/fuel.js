/*
 * Fuel Consumption Data
 */

var _ = require('lodash');

var queryParameters = {
  'co2_min': 'Integer',
  'co2_max': 'Integer',
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


exports.getAllCars = function(req, res){
  res.json(mockAllCars());
};

exports.getCars = function(req, res) {
  var cars = mockAllCars();
  var query = buildQuery(req);
  var qResult = runQuery(query, cars);
  res.json({success: true, result: qResult});
};


exports.getList = function(req, res) {
  var key = req.param('key');
  if (!key || listTypes.indexOf(key) < 0) {
    return res.json({success: false, result: "Key missing or invalid key."});
  }

  var cars = mockAllCars();
  var query = buildQuery(req);
  cars = runQuery(query, cars);

  var list = _.uniq(_.pluck(cars, key));
  list.sort(function(a, b) {
    return a < b;
  });

  res.json({success: true, result: list});
};



function buildQuery (req) {
  var query = {};
  possQueryKeys.forEach(function (keyName) {
    var value = req.param(keyName);
    if (!value && value !== 0) return;

    var check = checkValueValidity(value, keyName);
    if (!check.success) {
      return res.json({success: false, result: check.msg});
    }

    query[keyName] = value;
  });
  return query;
}


function checkValueValidity(value, keyName) {
  switch(queryParameters[key]) {
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
      return ( _.isFinite(value) && value >= 0 && parseInt(value, 10) === value);

    case 'Number':
      return ( _.isFinite(value) && value >= 0);

    default:
      console.error("checkValueValidity: forgot to define type " + queryParameters[key] + "!!!!");
  }
}


var queryKeyToProperty = {
  'co2_min': 'co2_emissions',
  'co2_max': 'co2_emissions',
  'engine_min': 'engine_size',
  'engine_max': 'engine_size',
  'year_min': 'year',
  'year_max': 'year'
};

function runQuery (query, cars) {
  var queryKeys = _.keys(query);
  if (queryKeys.length === 0) {
    return cars;
  }

  var filteredCars = cars.filter(function (car) {
    for (var i=0, l=queryKeys.length; i < l; i++) {
      
      var key = queryKeys[i];
      switch (key) {
        case 'cylinders':
        case 'fuel_type':
        case 'manufacturer':
        case 'model':
        case 'transmission':
        case 'vehicle_class':
        case 'year':
          if (_.isString(car[key]) && car[key].toLowerCase() !== query[key].toLowerCase()) {
            return false;
          }
          if ( (! _.isString(car[key])) && car[key] !== query[key]) {
            return false;
          }
          break;

        case 'co2_min':
        case 'engine_min':
        case 'year_min':
          var prop = car[queryKeyToProperty[key]];
          if (prop < query[key]) { return false; }
          break;

        case 'co2_max':
        case 'engine_max':
        case 'year_max':
          prop = car[queryKeyToProperty[key]];
          if (prop > query[key]) { return false; }
          break;

        case 'city_min':
          if (car.fuel_cons.city.metric < query[key]) { return false; }
          break;

        case 'city_max':
          if (car.fuel_cons.city.metric > query[key]) { return false; }
          break;

        case 'highway_min':
          if (car.fuel_cons.highway.metric < query[key]) { return false; }
          break;

        case 'highway_max':
          if (car.fuel_cons.highway.metric > query[key]) { return false; }
          break;
      }
    }
  });
  
  
}


function mockAllCars() {
  return {
    "success": true,
    "result": [
      {
        "_id": "mock00001",
        "year": 2014,
        "manufacturer": "Acura",
        "model": "ILX",
        "vehicle_class": "compact",
        "engine_size": 2,
        "cylinders": 4,
        "transmission": "AS5",
        "fuel_type": "Z",
        "fuel_cons": {
          "city": {
            "metric": 8.6,
            "imperial": 33
          },
          "highway": {
            "metric": 5.6,
            "imperial": 50
          }
        },
        "fuel_per_year": 1440,
        "co2_emissions": 166
      },
      {
        "_id": "mock00002",
        "year": 2000,
        "manufacturer": "Volvo",
        "model": "V70R AWD TURBO",
        "vehicle_class": "station wagon",
        "engine_size": 2.4,
        "cylinders": 5,
        "transmission": "A5",
        "fuel_type": "Z",
        "fuel_cons": {
          "city": {
            "metric": 13.1,
            "imperial": 22
          },
          "highway": {
            "metric": 9.2,
            "imperial": 31
          }
        },
        "fuel_per_year": 2269,
        "co2_emissions": 5219
      },
      {
        "_id": "mock00003",
        "year": 2005,
        "manufacturer": "Porsche",
        "model": "TARGA KIT",
        "vehicle_class": "subcompact",
        "engine_size": 3.6,
        "cylinders": 6,
        "transmission": "AS5",
        "fuel_type": "Z",
        "fuel_cons": {
          "city": {
            "metric": 13,
            "imperial": 22
          },
          "highway": {
            "metric": 8.4,
            "imperial": 34
          }
        },
        "fuel_per_year": 2179,
        "co2_emissions": 5012
      }
    ]
  };
}
