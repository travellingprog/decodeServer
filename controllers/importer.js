/*
 * Importer of Open Data
 */

var request= require('request'),
    config = require('../config'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    csv = require('csv'),
    MetaData = mongoose.model('MetaData'),
    Car = mongoose.model('Car');


exports.checkForUpdate = function() {
  request(config.metadataURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      checkMetaData(JSON.parse(body));
    }
    else {
      console.log("Error getting metadata update: " + error);
    }
  });
};


exports.getMetaData = function(req, res) {
  MetaData.find({}, function(err, result) {
    if (err) {
      return res.json({success: false, 'result': err});
    }
    return res.json({success: true, 'result': result});
  });
};


function checkMetaData (obj) {
  var resources = obj.result && obj.result.resources;
  if (!resources) return console.log('No resources found in metadata.');

  resources = _.where(resources, {language: 'eng; CAN'});  // get only english copy of data

  resources.forEach(function (resource) {

     MetaData.find({id: resource.id.trim()}, function(err, result) {
      if (err) return console.error(err);
      if (!result.length) {
        console.log('New metadata resource found! ' + resource.name);
        return saveMetaData(resource);
      }
      var find = result[0];
      var resourceTime = (new Date(resource.revision_timestamp)).getTime();
      if (resourceTime !== find.revision_timestamp) {
        console.log('Update to metadata resource found! ' + resource.name);
        return saveMetaData(resource);
      }
      console.log('We already have this metadata resource: ' + resource.name);
    });

  });
}


function saveMetaData (resource) {
  MetaData.update({id: resource.id}, {
    id: resource.id,
    name: resource.name,
    revision_timestamp: new Date(resource.revision_timestamp).getTime(),
    url: resource.url
  },
  {upsert: true},
  function(err) {
    if (err) return console.error('ERROR, importer: saving metadata failed. ', err);
    console.log('Saved metadata file successfully!');
    updateCars(resource.url);
  });
}


function updateCars(url) {
  var done = false;

  csv()
  .from(request(url))
  .on('record', function(row,index){
    if (index < 2 || done) return;
    if (! _.compact(row).length) {
      done = true;
      return console.log('numbers of cars in this file: ' + (index - 2));
    }
    else {
      createNewCar(row);
    }
  })
  .on('end', function(){
    console.log('done reading csv file.');
  })
  .on('error', function(error){
    console.log(error.message);
  });
}


function createNewCar (row) {
  var obj = {
    year: row[0],
    manufacturer: row[1],
    model: row[2],
    vehicle_class: row[3],
    engine_size: row[4],
    cylinders: row[5],
    transmission: row[6],
    fuel_type: row[7],
    fuel_cons: {
      city: {
        metric: row[8],
        imperial: row[10]
      },
      highway: {
        metric: row[9],
        imperial: row[11]
      }
    },
    fuel_per_year: row[12],
    co2_emissions: row[13]
  };
  obj = Car.cleanNewData(obj);

  Car.findSame(obj, function(err, car) {
    if (err) return console.error('ERROR, Importer: trouble finding a car.');

    if (!car) {
      car = new Car(obj);
    }
    else {
      _.keys(obj).forEach(function(key) {
        car[key] = obj[key];
      });
    }

    car.save(function (err) {
      if (err) {
        console.error('ERROR, Importer: Problem creating or updating a car. ' + err);
        console.error('Problem data: ', row);
      }
    });
  });
}