var pzone = require('./../.');
var serializeAddress = require('./serializeAddress');

function serializeFirstName(c, params, cache) {
  return { firstName: params.firstName || 'James' };
}

function serializeLastName(c, params, cache) {
  return { lastName: params.lastName || 'Gunn' };
}

function serializeFullName(c, params, cache) {
  return pzone(c, params, [
    serializeFirstName,
    serializeLastName
  ], cache).then(function (r) {
    return { fullName: r.firstName + r.lastName };
  });
}

function serializeEmail(c, params, cache) {
  return { email: params.email || 'jgunn987@gmail.com' };
}

function serializeAddressInfo(c, params, cache) {
  return serializeAddress(c, params.address || {})
    .then(function (address) {
      return { address: address };    
    });
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    serializeFirstName,
    serializeLastName,
    serializeFullName,
    serializeEmail,
    serializeAddressInfo
  ], cache);
}
