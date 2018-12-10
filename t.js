var assert = require('assert');
var parsers = require('.');

var serialized = 
  parsers.parseSerializationResults([
    { key: undefined }, 
    { value: 'include' }
  ]);

assert.ok(serialized.key === undefined, "Undefined value not filtered");
assert.ok(serialized.value === 'include', "Defined value not in object");

var validationSuccess = 
  parsers.parseValidationResults([
    { success: undefined } 
  ]);

assert.ok(validationSuccess.__success, "Successful validation not recognized");

var validationError = 
  parsers.parseValidationResults([
    { error: 'error' } 
  ]);

assert.ok(!validationError.__success, "Validation error not recognized");
assert.ok(validationError.error === 'error', "Validation error value not in object");
