var pzone = require('./../.');
var isemail = require('isemail');

function validateFirstName(c, params, cache) {
  return {};
}

function validateLastName(c, params, cache) {
  return {};
}

function validateFullName(c, params, cache) {
  return {};
}

function validateEmail(c, params, cache) {
  return { email: isemail.validate(params.email) ? undefined: 'Invalid Email' };
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    validateFirstName,
    validateLastName,
    validateFullName,
    validateEmail
  ], cache);
}
