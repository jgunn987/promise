var Promise = require('promise');
var isemail = require('isemail');
var parseKeys = require('./parseKeys');
var validObject = require('./validObject');
var validArray = require('./validArray');
var model = require('./model');
var validateAddress = require('./validateAddress');
var validateSubscription = require('./validateSubscription');

function validateAddressInfo(c, params) {
  return validateAddress(c, model(params.address, params))
    .then(function (result) {
      return { address: validObject(result) };
    });
}

function validateSubscribers(c, params) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return validateSubscription(c, model(s, params)).then(validObject);
  })).then(validArray)
     .then(function (subscribers) {
       return { subscriptions: subscribers };
     });
}

module.exports = function (c, params) {
  return Promise.all([
    {
      _id: params._id ? params._id.length === 36 ? undefined : 'Invalid Id' : undefined,
      firstName: params.firstName ? undefined : 'No first name',
      lastName: params.lastName ? undefined : 'No last name',
      email: isemail.validate(params.email) ? undefined: 'Invalid Email'
    },
    validateAddressInfo(c, params),
    validateSubscribers(c, params)
  ]).then(parseKeys);
}
