var Promise = require('promise');
var isemail = require('isemail');
var parseResults = require('./parseResults');
var isEmpty = require('./isEmpty');
var validateAddress = require('./validateAddress');
var validateSubscription = require('./validateSubscription');

function validateSync(c, params, cache) {
  return Promise.resolve({
    firstName: params.firstName ? undefined : 'No first name',
    lastName: params.lastName ? undefined : 'No last name',
    email: isemail.validate(params.email) ? undefined: 'Invalid Email'
  });
}

function validateAddressInfo(c, params, cache) {
  return validateAddress(c, Object.assign(params.address || {}, {
    _parent: params
  })).then(function (result) {
    return { address: isEmpty(result) ? undefined : result };
  });
}

function validateSubscribers(c, params, cache) {
  var subscriptions = params.subscriptions || [];
  return Promise.all(subscriptions.map(function (s) {
    return validateSubscription(c, Object.assign(s, {
      _parent: params      
    })).then(function (validation) {
      return isEmpty(validation) ? undefined : validation;
    });
  })).then(function (subscribers) {
    return { subscriptions: 
      subscribers.find(function (v) {
        return !!v;
      }) ? subscribers : undefined
    };
  });
}

module.exports = function (c, params, cache) {
  return Promise.all([
    validateSync(c, params),
    validateAddressInfo(c, params),
    validateSubscribers(c, params)
  ]).then(parseResults);
}
