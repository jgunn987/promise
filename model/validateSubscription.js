var Promise = require('promise');

module.exports = function (c, params, cache) {
  return Promise.resolve({
    events: params.events.indexOf('sms') === -1 ? undefined : 'SMS not supported'
  });
}
