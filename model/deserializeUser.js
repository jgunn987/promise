var Promise = require('promise');
var model = require('./model');
var parseResults = require('./parseResults');
var deserializeAddress = require('./deserializeAddress');
var deserializeSubscription = require('./deserializeSubscription');

function deserializeAddressInfo(c, params) {
  return deserializeAddress(c, model(params.address, params))
    .then(function (address) {
      return { address: address };
    });
}

function deserializeSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return deserializeSubscription(c, model(s, params));
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params, cache) {
  return Promise.all([
    {
      _id: params._id,
      firstName: params.firstName,
      lastName: params.lastName,
      fullName: params.fullName,
      email: params.email
    },
    deserializeAddressInfo(c, params),
    deserializeSubscribers(c, params)
  ]).then(parseResults);
};
