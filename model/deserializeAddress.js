Promise = require('promise');

module.exports = function (c, params, cache) {
  return Promise.resolve({
    firstLine: params.firstLine,
    secondLine: params.secondLine,
    country: params.country,
    postcode: params.postcode
  });
};
