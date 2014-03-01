# Requests

You can send the parameters as URL parameters, like the example above, or as an object inside the form-data header (aka the *data* argument for jQuery's $.get() method).


# Responses

All responses will be JSON objects with the two fields:

* success (boolean)
* result (array or error message)


# Paths

####/fuel/all

All cars.


####/fuel/cars?(parameter1)=(value1)&(parameter2)=(value2)&...

Will retrieve cars that match the query parameters given. 

Possible parameter keys:

  - class (string or array of strings)
  - co2_min (integer)
  - co2_max (integer)
  - cylinders (integer)
  - engine_min (number)
  - engine_max (number)
  - city_min (number) (provide metric value)
  - city_max (number) (provide metric value)
  - highway_min (number) (provide metric value)
  - highway_max (number) (provide metric value)
  - fuel_type (string or array of strings)
  - manufacturer (string or array of strings)
  - model (string or array of strings)
  - transmission (string or array of strings)
  - year (integer)
  - year_min (integer)
  - year_max (integer)


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



