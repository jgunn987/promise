var pzone = require('./../.');
var serializeAddress = require('./serializeAddress');
var serializeSubscription = require('./serializeSubscription');

function serializeId(c, params) {
  return { _id: params._id };
}

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

function serializeSubscriptionInfo(c, params, cache) {
  return serializeAddress(c, params.subscriptions || {})
    .then(function (address) {
      return { address: address };    
    });
}

function serializeSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return serializeSubscription(c, s);
  })).then(function (subscribers) {
    return { subscriptions: subscribers };     
  });
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    serializeId,
    serializeFirstName,
    serializeLastName,
    serializeFullName,
    serializeEmail,
    serializeAddressInfo,
    serializeSubscribers
  ], cache);
}