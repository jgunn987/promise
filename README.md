#### Order of Execution
Validation takes precendence over serialization when processing incoming messages, so validators must be written to process unserialized data

#### Serialization and Validation
Each field serializer and validator is a function with the following signature;
```
function (c, params, cache)
```
```c``` is an ```Object```, a container storing dependencies,
```params``` is an ```Object```, the message payload or data model
```cache``` is and ```Object```, the current execution cache of the operation. To ensure handlers can retrieve values from other handlers that have already executed.
If the function is synchonous, it's return type is an object in the following form; 
If the function is async it is required to return a promise which returns the same object form.
```
{ [fieldName] : [value] }
```
A handler may return partial objects, for example;
```
{ 
  updatedAt: new Date(), 
  updatedBy: params.user.name
}
```
For validators the value field of this object should be set to ```undefined``` for a successful operation or on failure one of the following 
Atomic fields = ```string```
Nested Fields = ```object```
Arrays = ```array```

### Dependencies
A handler may depend on the results of other handlers. To ensure a handler is not called more than once it is recommended to cache results into the cache object. For example
```
function fieldName(c, params, cache) {
  return cache.fieldName = cache.fieldName ||
    { fieldName: params.fieldName.toString() };
}
```
It is recommended that ```Promise.all``` is used to reference other dependant handlers. For example;
```
function serializeFullName(c, params, cache) {
  return cache.fullName = cache.fullName ||
    Promise.all([
      serializeFirstName(c, params, cache),
      serializeLastName(c, params, cache)
    ]).then(function (r) {
      return { fullName: r[0].firstName + ' + ' + r[1].lastName }; 
    });
}
```
### Conditional Processing
A handler may also want to perform conditional processing. As with dependencies, the use of ```Promise.all``` is recommended. For example;
```
function serializeHashName(c, params, cache) {
  return cache.hashName = cache.hashName ||
    serializeFullName(c, params, cache)
      .then(function (r) {
        return { name: 
          r.fullName === 'James Gunn' ? 'ok' : undefined
        };
      });
}
```
### Parsing Results
All results that have an undefined ```value``` field will not be included in the output when parsing results.
Two functions are defined for processing handler results, 
```parseValidationResults```
```parseSerializationResults```


