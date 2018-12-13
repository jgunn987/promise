var assert = require('assert');
var parsers = require('.');

var serialized = 
  parsers.parseSerializationResults([
    { key: undefined }, 
    { value: 'include' }
  ]);

assert.ok(!('key' in serialized) && serialized.key === undefined, 
  "Undefined value not filtered");
assert.ok(serialized.value === 'include', 
  "Defined value not in object");

