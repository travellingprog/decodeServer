/*
 * Importer of Open Data
 */

var http = require('http'),
    config = require('../config'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    MetaData = mongoose.model('MetaData');


exports.checkForUpdate = function() {
  http.get(config.metadataURL, function(res) {
    var output = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
        output += chunk;
    });

    res.on('end', function() {
        var obj = JSON.parse(output);
        checkMetaData(res.statusCode, obj);
    });

  }).on('error', function(e) {
    console.log("Error getting metadata update: " + e.message);
  });
};


function checkMetaData (statusCode, obj) {
  if (statusCode !== 200) {
    return console.log('ERROR, Importer: metadata came back with code !== 200');
  }

  var resources = obj.result && obj.result.resources;
  if (!resources) return console.log('No resources found in metadata.');

  resources = _.where(resources, {language: 'eng; CAN'});  // get only english copy of data

  resources.forEach(function (resource) {

     MetaData.find({id: resource.id}, function(err, result) {
      if (err) return console.error(err);
      if (!result.length) {
        console.log('New metadata resource found!');
        return saveMetaData(resource);
      }
      var find = result[0];
      var resourceTime = (new Date(resource.revision_timestamp)).getTime();
      if (resourceTime !== find.revision_timestamp) {
        console.log('Update to metadata resource found!');
        return saveMetaData(resource);
      }
      console.log('We already have this metadata resource.');
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
    // update Cars collection
  });
}


