var Promise = require('promise');
var pzone = require('./../.');
var defaultAddress = require('./defaultAddress');
var defaultSubscription = require('./defaultSubscription');

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

function defaultSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return defaultSubscription(c, s);
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    defaultFirstName,
    defaultLastName,
    defaultFullName,
    defaultEmail,
    defaultAddressInfo,
    defaultSubscribers
  ], cache);
}
