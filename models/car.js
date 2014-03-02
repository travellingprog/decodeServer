var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CarSchema = new Schema({
  year: Number,
  manufacturer: {type: String, trim: true, uppercase: true},
  model: {type: String, trim: true, uppercase: true},
  vehicle_class: {type: String, trim: true, uppercase: true},
  engine_size: Number,
  cylinders: Number,
  transmission: {type: String, trim: true, uppercase: true},
  fuel_type: {type: String, trim: true, uppercase: true},
  fuel_cons: {
    city: {
      metric: Number,
      imperial: Number
    },
    highway: {
      metric: Number,
      imperial: Number
    }
  },
  fuel_per_year: Number,
  co2_emissions: Number
});


CarSchema.statics.findSame = function(obj, cb) {
  var query = {
    year: obj.year,
    manufacturer: obj.manufacturer.trim().toUpperCase(),
    model: obj.model.trim().toUpperCase(),
    transmission: obj.transmission.trim().toUpperCase()
  };
  this.findOne(query, cb);
};

CarSchema.statics.cleanNewData = function(obj) {
  obj.year = parseInt(obj.year, 10);
  if (obj.year === 2104) obj.year = 2014;

  obj.engine_size = parseFloat(obj.engine_size);

  if (obj.cylinders === 'R2') obj.cylinders = 0;
  obj.cylinders = parseInt(obj.cylinders, 10);

  obj.fuel_cons.city.metric = parseFloat(obj.fuel_cons.city.metric);
  obj.fuel_cons.city.imperial = parseFloat(obj.fuel_cons.city.imperial);
  obj.fuel_cons.highway.metric = parseFloat(obj.fuel_cons.highway.metric);
  obj.fuel_cons.highway.imperial = parseFloat(obj.fuel_cons.highway.imperial);

  obj.fuel_per_year = parseFloat(obj.fuel_per_year);
  obj.co2_emissions = parseFloat(obj.co2_emissions);

  return obj;
};


mongoose.model('Car', CarSchema);