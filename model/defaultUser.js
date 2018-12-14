var pzone = require('./../.');
var defaultAddress = require('./defaultAddress');

function defaultFirstName(c, params, cache) {
  return { firstName: params.firstName || 'James' };
}

function defaultLastName(c, params, cache) {
  return { lastName: params.lastName || 'Gunn' };
}

function defaultFullName(c, params, cache) {
  return pzone(c, params, [
    defaultFirstName,
    defaultLastName
  ], cache).then(function (r) {
    return { fullName: r.firstName + r.lastName };
  });
}

function defaultEmail(c, params, cache) {
  return { email: params.email || 'jgunn987@gmail.com' };
}

function defaultAddressInfo(c, params, cache) {
  return defaultAddress(c, params.address || {})
    .then(function (address) {
      return { address: address };
    });
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    defaultFirstName,
    defaultLastName,
    defaultFullName,
    defaultEmail,
    defaultAddressInfo
  ], cache);
}
