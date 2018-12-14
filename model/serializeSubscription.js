var pzone = require('./../.');

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    function (c, params) {
      return {
        user: params.user,
        events: params.events
      };
    }
  ], cache);
}
