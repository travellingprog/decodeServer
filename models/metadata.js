var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MetaDataSchema = new Schema({
  id: {type: String, trim: true },
  name: {type: String, trim: true },
  revision_timestamp: Date,
  url: {type: String, trim: true },
});

mongoose.model('MetaData', MetaDataSchema);