# Requests

You can send the parameters as URL parameters, like the example above, or as an object inside the form-data header (aka the *data* argument for jQuery's $.get() method).


# Responses

All responses will be JSON objects with the following two fields


# Paths

####/fuel/all

All cars.


####/fuel/cars?(parameter1)=(value1)&(parameter2)=(value2)&...

Will retrieve cars that match the query parameters given. 

Possible parameter keys:

  - class*
  - co2_emissions_min
  - co2_emissions_max
  - cylinders
  - engine_size_min
  - engine_size_max
  - fuel_city_min
  - fuel_city_max
  - fuel_highway_min
  - fuel_highway_max
  - fuel_type*
  - manufacturer*
  - model*
  - transmission*
  - year
  - yearMin
  - yearMax

*_can be an array of values._


####/fuel/list?key=(parameterName)

Will list all the possible values for a certain parameter key.

Possible parameter names:

  - class
  - cylinders
  - manufacturer
  - model
  - transmission
  - year


####/fuel/list?key=(parameterName)&(parameter1)=(value1)&(parameter2)=(value2)

This would list all the possibles values for a certain parameter, restricted by other parameter values.

Essentially, this is the same as doing the `/fuel/cars` query, followed by retrieving the unique values for a certain key in the resulting cars array.



