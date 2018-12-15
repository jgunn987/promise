var Promise = require('promise');

module.exports = function (c, params) {
  return Promise.resolve({
    events: params.events.indexOf('sms') === -1 ? undefined : 'SMS not supported'
  });
}
