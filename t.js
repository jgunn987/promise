var assert = require('assert');
var parsers = require('.');

var serialized = 
  parsers.parseSerializationResults([
    { key: undefined }, 
    { value: 'include' }
  ]);

var validationSuccess = 
  parsers.parseValidationResults([
    { success: undefined } 
  ]);

var validationError = 
  parsers.parseValidationResults([
    { error: 'error' } 
  ]);

var validationSuccessObject = 
  parsers.parseValidationResults([
    { object: { __success: true } } 
  ]);

var validationErrorObject = 
  parsers.parseValidationResults([
    { object: { key: 'error', __success: false } } 
  ]);

var validationSuccessArray =
  parsers.parseValidationResults([
    { array: [undefined] } 
  ]);

var validationErrorArray =
  parsers.parseValidationResults([
    { array: ['error'] } 
  ]);

var validationSuccessArrayObjects = 
  parsers.parseValidationResults([
    { array: [{ __success: true }] } 
  ]);

var validationErrorArrayObjects = 
  parsers.parseValidationResults([
    { array: [{ key: 'error', __success: false }] } 
  ]);

assert.ok(serialized.key === undefined, 
  "Undefined value not filtered");
assert.ok(serialized.value === 'include', 
  "Defined value not in object");
assert.ok(validationSuccess.__success, 
  "Successful validation not recognized");
assert.ok(!validationError.__success, 
  "Validation error not recognized");
assert.ok(validationError.error === 'error', 
  "Validation error value not in object");
assert.ok(validationSuccessObject.__success, 
  "Validation success not recognized on nested object");
assert.ok(validationSuccessObject.object.__success, 
  "Validation success not recognized on nested object");
assert.ok(!validationErrorObject.__success, 
  "Validation error not recognized on nested object");
assert.ok("__success" in validationErrorObject.object, 
  "Validation error not recognized on nested object");
assert.ok(validationErrorObject.object.key === 'error', 
  "Validation error value not in nested object");
assert.ok(validationSuccessArray.__success, 
  "Validation success not recognized on array");
assert.ok(!validationErrorArray.__success, 
  "Validation error not recognized on array");
assert.ok(validationSuccessArrayObjects.__success, 
  "Validation success not recognized on array of objects");
assert.ok(!validationErrorArrayObjects.__success, 
  "Validation error not recognized on array of objects");

