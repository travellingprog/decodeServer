/*
 * Fuel Consumption Data
 */


exports.getAllData = function(req, res){
  res.json(mockAllData());
};



function mockAllData() {
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
        "vehicle_class": "STATION WAGON",
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
        "manufacturer": "PORSCHE",
        "model": "TARGA KIT",
        "vehicle_class": "SUBCOMPACT",
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
