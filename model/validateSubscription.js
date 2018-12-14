var pzone = require('./../.');

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    function (c, params) {
      return {
        events: params.events.indexOf('sms') === -1 ? undefined : 'SMS not supported'
      };
    }
  ], cache);
}
