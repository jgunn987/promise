var pzone = require('./../.');
var deserializeAddress = require('./deserializeAddress');
var deserializeSubscription = require('./deserializeSubscription');

function deserializeFirstName(c, params) {
  return { firstName: params.firstName };
}

function deserializeLastName(c, params) {
  return { lastName: params.lastName };
}

function deserializeEmail(c, params) {
  return { email: params.email };
}

function deserializeAddressInfo(c, params) {
  return deserializeAddress(c, params)
    .then(function (address) {
      return { address: params.address };
    });
}

function deserializeSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return deserializeSubscription(c, s);
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    deserializeFirstName,
    deserializeLastName, 
    deserializeEmail,
    deserializeAddressInfo,
    deserializeSubscribers
  ], cache);
};
