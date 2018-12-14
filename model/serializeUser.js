var Promise = require('promise');
var parseResults = require('./parseResults');
var serializeAddress = require('./serializeAddress');
var serializeSubscription = require('./serializeSubscription');

function serializeSync(c, params) {
  return Promise.resolve({ 
    _id: params._id,
    firstName: params.firstName || 'James',
    lastName: params.lastName || 'Gunn',
    email: params.email || 'jgunn987@gmail.com' 
  });
}

function serializeFullName(c, params, cache) {
  return c.get(params._id, 'serializeSync')
    .then(function (r) {
      return { fullName: r.firstName + r.lastName };
    });
}

function serializeAddressInfo(c, params, cache) {
  return serializeAddress(c, Object.assign(params.address || {}, {
    _parent: params
  })).then(function (address) {
    return { address: address };    
  });
}

function serializeSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return serializeSubscription(c, Object.assign(s, {
      _parent: params      
    }));
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params, cache) {
  return Promise.all([
    c.set(params._id, 'serializeSync', serializeSync(c, params)),
    serializeFullName(c,params),
    serializeAddressInfo(c, params),
    serializeSubscribers(c, params)
  ]).then(parseResults);
}
