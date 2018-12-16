var Promise = require('promise');
var model = require('./model');
var parseKeys = require('./parseKeys');
var defaultAddress = require('./defaultAddress');
var defaultSubscription = require('./defaultSubscription');

function defaultAddressInfo(c, params) {
  return defaultAddress(c, model(params.address || {}, params))
    .then(function (address) {
      return { address: address };
    });
}

function defaultSubscribers(c, params) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return defaultSubscription(c, model(s, params));
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params) {
  return Promise.all([
    {
      _id: params._id,
      firstName: params.firstName || 'James',
      lastName: params.lastName || 'Gunn',
      email: params.email || 'jgunn987@gmail.com',
      fullName: params.firstName + params.lastName
    },
    defaultAddressInfo(c, params),
    defaultSubscribers(c, params)
  ]).then(parseKeys)
}
