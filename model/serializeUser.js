var Promise = require('promise');
var parseObjectKeys = require('./parseObjectKeys');
var serializeAddress = require('./serializeAddress');
var serializeSubscription = require('./serializeSubscription');

function serializeAddressInfo(c, params) {
  return serializeAddress(c, Object.assign(params.address || {}, {
    _parent: params
  })).then(function (address) {
    return { address: address };    
  });
}

function serializeSubscribers(c, params) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return serializeSubscription(c, Object.assign(s, {
      _parent: params      
    }));
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
    serializeAddressInfo(c, params),
    serializeSubscribers(c, params)
  ]).then(parseObjectKeys);
}
