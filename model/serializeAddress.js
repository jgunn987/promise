Promise = require('promise');

module.exports = function (c, params, cache) {
  return Promise.resolve({
    firstLine: params.firstLine.trim(),
    secondLine: params.secondLine.trim(),
    country: params.country.trim(),
    postcode: params.postcode.trim()
  });
};
