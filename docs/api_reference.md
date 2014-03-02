# Overview

This API provides information on cars in Canada produced since the year 2000. The information revolves the fuel consumption of these cars, but other information is available as well (for instance, the transmission type). 

This project was developed as part of the AutoScout app, our team's entry in the [CODE hackathon](https://www.canadianopendataexperience.com/). As such, it is provided 'as is'.

You can read this documentation in the [GitHub repo](https://github.com/travellingprog/decodeServer/blob/master/docs/api_reference.md) (recommended) or at [http://api.getautoscout.com](http://api.getautoscout.com).

The data behind this API is retrieved from the **Fuel Consumption Ratings** datasets published by Natural Resources Canada. These are published at the following web address:
[http://data.gc.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64](http://data.gc.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64)

**The server checks for new data every 24 hours and automatically updates when a new dataset is detected.**

The data is used under the terms of the [Open Government License - Canada](http://data.gc.ca/eng/open-government-licence-canada).


# Use

The API is currently hosted at [http://young-stream-4848.herokuapp.com](http://young-stream-4848.herokuapp.com). This is the hostname that applications should use to connect to the API.

The API data can also be retrieved by using [http://api.getautoscout.com](http://api.getautoscout.com) as the host name. However, because we are simply forwarding the request to the Heroku address given above, using this address within an application will likely result in an *Access-Control-Allow-Origin* error.


# Requests

This API only accepts **GET** requests.

You can send the parameters as URL parameters, or as an object inside the form-data header (aka the *data* argument for jQuery's $.get() method).


# Responses

All responses will be JSON objects with these two fields:

* success (boolean)
* result (array or error message)


# Paths

### GET /fuel/all

Get all cars. Expect this to take a while. At the time of writing, there were 14305 cars in the database. **PLEASE use this method sparingly**.

**jQuery example**:

    var host = 'http://young-stream-4848.herokuapp.com';

    $.get(host + '/fuel/all', function (response) {
      $(body).text(JSON.stringify(response));
    });

**Response:**

    {
      success: true,
      result: [
        {
          year: 2014,
          manufacturer: "HONDA",
          model: "CIVIC",
          vehicle_class: "COMPACT",
          engine_size: 1.8,
          cylinders: 4,
          transmission: "M5",
          fuel_type: "X",
          fuel_per_year: 1300,
          co2_emissions: 150,
          _id: "5312e21d84549a6c013a96c8",
          __v: 0,
          fuel_cons: {
            highway: {
              metric: 5.5,
              imperial: 51
            },
            city: {
              metric: 7.3,
              imperial: 39
            }
          }
        },
        // ... many more cars
      ]
    }


### GET /fuel/cars?(parameter1)=(value1)&(parameter2)=(value2)&...

Will retrieve cars that match the query parameters given. 

Possible parameter keys:

- **limit**: *integer.* The maximum amount of results that you wish to retrieve. If unspecified, **defaults to 25 for `/fuel/cars`** (this parameter can also be used with `/fuel/list`, see below).

- **class**: *string or array of strings*  The class of the vehicle (e.g. "subcompact").

- **co2_min**: *number* Filter out any vehicles with annual co2 emissions (in kg) below this value.

- **co2_max**: *number* Filter out any vehicles with annual co2 emissions (in kg) above this value.

- **cylinders**: *integer* The number of cylinders that the vehicle must have. For cars with rotary engines, this value is zero.

- **engine_min**: *number* Filter out any vehicles with engine sizes (in L) below this value.

- **engine_max**: *number* Filter out any vehicles with engine sizes (in L) above this value.

- **city_min**: *number*  Filter out any vehicles with city-rated fuel consumption (in L per 100 km) below this value.

- **city_max**: *number* Filter out any vehicles with city-rated fuel consumption (in L per 100 km) above this value.

- **highway_min**: *number* Filter out any vehicles with highway-rated fuel consumption (in L per 100 km) below this value.

- **highway_max**: *number* Filter out any vehicles with highway-rated fuel consumption (in L per 100 km) above this value.

- **fuel_type**: *string or array of strings* The fuel type for this vehicle. X = Regular gasoline;  Z = Premium gasoline;  D = Diesel;  E = E85;  B = Electricity.

- **manufacturer**: *string or array of strings* The manufacturer of this vehicle (e.g. 'Honda').

- **model**: *string or array of strings* The model of this vehicle (e.g. 'Civic').

- **transmission**: *string or array of strings* The type of the tranmission. A = Automatic;  AM = Automated manual;  AS = Automatic with select shift;  AV = Continuously variable;
Mn = Manual;  n = Number of gears/speeds (1-8) (e.g "M6")

- **year**: *integer* The production year of this vehicle.

- **year_min**: *integer* Filter out any vehicles with a production year below this value.

- **year_max**: *integer* Filter out any vehicles with a production year below this value.

**View in browser**:
[Link](http://young-stream-4848.herokuapp.com/fuel/cars?fuel_type=[%27X%27,%27D%27]&year_min=2010&city_max=9&limit=2)


**jQuery example**:

    var host = 'http://young-stream-4848.herokuapp.com';
    var data = {
      fuel_type: ['X','D'],
      year_min: 2010,
      city_max: 9,
      limit: 2
    };

    $.get(host + '/fuel/cars', data, function (response) {
      $(body).text(JSON.stringify(response));
    });


**Response:**

    {
      success: true,
      result: [
        {
          year: 2014,
          manufacturer: "AUDI",
          model: "Q5 TDI CLEAN DIESEL",
          vehicle_class: "SUV - SMALL",
          engine_size: 3,
          cylinders: 6,
          transmission: "AS8",
          fuel_type: "D",
          fuel_per_year: 1560,
          co2_emissions: 211,
          _id: "5312e21b84549a6c013a958a",
          __v: 0,
          fuel_cons: {
            highway: {
              metric: 6.4,
              imperial: 44
            },
            city: {
              metric: 9,
              imperial: 31
            }
          }
        },
        {
          year: 2014,
          manufacturer: "AUDI",
          model: "A8L TDI CLEAN DIESEL",
          vehicle_class: "FULL-SIZE",
          engine_size: 3,
          cylinders: 6,
          transmission: "AS8",
          fuel_type: "D",
          fuel_per_year: 1440,
          co2_emissions: 194,
          _id: "5312e21b84549a6c013a9589",
          __v: 0,
          fuel_cons: {
            highway: {
              metric: 5.4,
              imperial: 52
            },
            city: {
              metric: 8.7,
              imperial: 32
            }
          }
        }
      ]
    }



### GET /fuel/list?key=(parameterName)

Will list all the possible values for a certain parameter key.

Possible parameter names:

  - class
  - cylinders
  - manufacturer
  - model
  - transmission
  - year

**View in browser**:
[Link](http://young-stream-4848.herokuapp.com/fuel/list?key=manufacturer)


**jQuery example**:

    var host = 'http://young-stream-4848.herokuapp.com';
    var data = {key: 'manufacturer'};

    $.get(host + '/fuel/list', data, function (response) {
      $(body).text(JSON.stringify(response));
    });


**Response**:

    {
      success: true,
      result: [
        "ACURA",
        "ASTON MARTIN",
        "AUDI",
        "BENTLEY",
        "BMW",
        "BUGATTI",
        "BUICK",
        "CADILLAC",
        "CHEVROLET",
        "CHRYSLER",
        "DAEWOO",
        "DODGE",
        "FERRARI",
        "FIAT",
        "FORD",
        "GMC",
        "HONDA",
        "HUMMER",
        "HYUNDAI",
        "INFINITI",
        "ISUZU",
        // ... the rest of the manufacturers
      ]
    }



### GET /fuel/list?key=(parameterName)&(parameter1)=(value1)&(parameter2)=(value2)

This would list all the possibles values for a certain parameter, restricted by other parameter values.

Essentially, this is the same as doing the `/fuel/cars` query, followed by retrieving the unique values for a certain key in the resulting cars array.

**View in browser**:
[Link](http://young-stream-4848.herokuapp.com/fuel/list?key=manufacturer&city_max=6)


**jQuery example**:

    var host = 'http://young-stream-4848.herokuapp.com';
    var data = {
      key: 'manufacturer',
      city_max: 6
    };

    $.get(host + '/fuel/list', data, function (response) {
      $(body).text(JSON.stringify(response));
    });


**Response:**

    {
      success: true,
      result: [
        "ACURA",
        "CHEVROLET",
        "FORD",
        "HONDA",
        "HYUNDAI",
        "KIA",
        "LEXUS",
        "LINCOLN",
        "MITSUBISHI",
        "NISSAN",
        "SCION",
        "SMART",
        "TOYOTA",
        "VOLKSWAGEN"
      ]
    }


### GET /metadata

A brief summary of the data sources used by the API.

**View in browser**:
[Link](http://young-stream-4848.herokuapp.com/metadata)


**jQuery example**:

    var host = 'http://young-stream-4848.herokuapp.com';

    $.get(host + '/metadata', function (response) {
      $(body).text(JSON.stringify(response));
    });


**Response:**

    {
      success: true,
      result: [
        {
          _id: "5312a49130bf65b3f89c77e0",
          id: "40c0aad2-122c-4b73-9b38-8e54f3a6164e",
          name: "Fuel Consumption Ratings - 2013",
          revision_timestamp: 1390335008067,
          url: "http://oee.nrcan.gc.ca/sites/oee.nrcan.gc.ca/files/files/csv/MY2013-Fuel-Consumption-Ratings.csv"
        },
        {
          _id: "5312a49130bf65b3f89c77e1",
          id: "0dd9fede-8a81-47d6-a5fc-ffda84dcebc6",
          name: "Fuel Consumption Ratings - 2012",
          revision_timestamp: 1390335008067,
          url: "http://oee.nrcan.gc.ca/sites/oee.nrcan.gc.ca/files/files/csv/MY2012-Fuel-Consumption-Ratings.csv"
        },
        {
          _id: "5312a49130bf65b3f89c77e2",
          id: "50d96562-8460-445c-b0f6-d0156ebcad07",
          name: "Fuel Consumption Ratings - 2007",
          revision_timestamp: 1390335008067,
          url: "http://oee.nrcan.gc.ca/sites/oee.nrcan.gc.ca/files/files/csv/MY2007-Fuel-Consumption-Ratings.csv"
        },
        // ... more data source metadata
      ]
    }
