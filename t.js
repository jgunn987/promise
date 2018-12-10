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
    { object: { __valid: true } } 
  ]);

var validationErrorObject = 
  parsers.parseValidationResults([
    { object: { key: 'error', __valid: false } } 
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
    { array: [{ __valid: true }] } 
  ]);

var validationErrorArrayObjects = 
  parsers.parseValidationResults([
    { array: [{ key: 'error', __valid: false }] } 
  ]);

assert.ok(serialized.key === undefined, 
  "Undefined value not filtered");

assert.ok(serialized.value === 'include', 
  "Defined value not in object");

assert.ok(validationSuccess.__valid, 
  "Successful validation not recognized");

assert.ok(!validationError.__valid, 
  "Validation error not recognized");

assert.ok(validationError.error === 'error', 
  "Validation error value not in object");

assert.ok(validationSuccessObject.__valid, 
  "Validation success not recognized on nested object");

assert.ok(validationSuccessObject.object.__valid, 
  "Validation success not recognized on nested object");

assert.ok(!validationErrorObject.__valid, 
  "Validation error not recognized on nested object");

assert.ok("__valid" in validationErrorObject.object, 
  "Validation error not recognized on nested object");

assert.ok(validationErrorObject.object.key === 'error', 
  "Validation error value not in nested object");

assert.ok(validationSuccessArray.__valid, 
  "Validation success not recognized on array");

assert.ok(!validationErrorArray.__valid, 
  "Validation error not recognized on array");

assert.ok(validationSuccessArrayObjects.__valid, 
  "Validation success not recognized on array of objects");

assert.ok(!validationErrorArrayObjects.__valid, 
  "Validation error not recognized on array of objects");

