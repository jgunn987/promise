Order of Execution
==================
Validation takes precendence over serialization when processing incoming messages, so validators must be written to process unserialized data

Serialization and Validation
============================
Each field serializer and validator is a function with the following signature;
```
function (c, params, result)
```
If the function is synchonous, it's return type is an object in the following form; 
If the function is async it is required to return a promise which returns the same object form.
```
{ [fieldName] : [value] }
```

For validators the value field of this object should be set to ```undefined``` for a successful operation or on failure one of the following 
Atomic fields = ```string```
Nested Fields = ```object```
Arrays = ```array```

Dependencies
============
A handler may depend on the results of other handlers. To ensure a handler is not called more than once it is recommended to cache results into the ```result``` field. For example
```
function fieldName(c, params, result) {
  return result.fieldName = result.fieldName ||
    { fieldName: params.fieldName.toString() };
}
```
It is recommended that ```Promise.all``` is used to reference other dependant handlers. For example;
```
function serializeFullName(c, params, result) {
  return result.fullName = result.fullName ||
    Promise.all([
      serializeFirstName(c, params, result),
      serializeLastName(c, params, result)
    ]).then(function (r) {
      return { fullName: r[0].firstName + ' + ' + r[1].lastName }; 
    });
}
```

Conditional Processing
======================
A handler may also want to perform conditional processing. As with dependencies, the use of ```Promise.all``` is recommended. For example;
```
function serializeHashName(c, params, result) {
  return result.hashName = result.hashName ||
    serializeFullName(c, params, result)
      .then(function (r) {
        return { hashName: 
          r.fullName === 'James Gunn' ? 'ok' : undefined
        };
      });
}
```

Parsing Results
===============
All results that have an undefined ```value``` field will not be included in the output when parsing results.
Two functions are defined for processing handler results, 
```parseValidationResults```
```parseSerializationResults```

