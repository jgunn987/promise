Promise = require('promise');

module.exports = function (c, params) {
  return Promise.resolve({
    _id: params._id,
    user: params.user,
    events: params.events
  });
}
