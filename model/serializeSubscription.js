var Promise = require('promise');

module.exports = function (c, params, cache) {
  return Promise.resolve({
    user: params.user,
    events: params.events
  });
}
