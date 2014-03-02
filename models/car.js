var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CarSchema = new Schema({
  year: Number,
  manufacturer: {type: String, trim: true},
  model: {type: String, trim: true},
  vehicle_class: {type: String, trim: true},
  engine_size: Number,
  cylinders: Number,
  transmission: {type: String, trim: true},
  fuel_type: {type: String, trim: true},
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

CarSchema.virtual('id').get(function() {
    return this._id;
});

mongoose.model('Car', CarSchema);