var Promise = require('promise');
var uuid = require('uuid');
var parseResults = require('./parseResults');
var defaultAddress = require('./defaultAddress');
var defaultSubscription = require('./defaultSubscription');

function defaultSync(c, params, cache) {
  return Promise.resolve({ 
    _id: params._id,
    firstName: params.firstName || 'James',
    lastName: params.lastName || 'Gunn',
    email: params.email || 'jgunn987@gmail.com',
  });
}

function defaultFullName(c, params, cache) {
  return c.get(params._id, 'defaultSync')
    .then(function (r) {
      return { fullName: r.firstName + r.lastName };
    });
}

function defaultAddressInfo(c, params, cache) {
  return defaultAddress(c, Object.assign(params.address || {}, {
    _parent: params,
    _id: uuid.v4()
  })).then(function (address) {
    return { address: address };
  });
}

function defaultSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return defaultSubscription(c, Object.assign(s, {
      _parent: params,
      _id: uuid.v4()
    }));
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params, cache) {
  return Promise.all([
    c.set(params._id, 'defaultSync', defaultSync(c, params)),
    defaultFullName(c, params),
    defaultAddressInfo(c, params),
    defaultSubscribers(c, params)
  ]).then(parseResults)
}
