var pzone = require('./../.');
var isemail = require('isemail');
var validateAddress = require('./validateAddress');

function validateFirstName(c, params, cache) {
  return { firstName: params.firstName ? undefined : 'No first name' };
}

function validateLastName(c, params, cache) {
  return { lastName: params.lastName ? undefined : 'No last name' };
}

function validateFullName(c, params, cache) {
  return {};
}

function validateEmail(c, params, cache) {
  return { email: isemail.validate(params.email) ? undefined: 'Invalid Email' };
}

function validateAddressInfo(c, params, cache) {
  return validateAddress(c, params.address || {})
    .then(function (result) {
      return { address: Object.keys(result).length ? result : undefined };
    });
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    validateFirstName,
    validateLastName,
    validateFullName,
    validateEmail,
    validateAddressInfo
  ], cache);
}
