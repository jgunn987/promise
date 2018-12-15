Promise = require('promise');

module.exports = function (c, params) {
  return Promise.resolve({
    _id: params._id,
    firstLine: params.firstLine.trim(),
    secondLine: params.secondLine.trim(),
    country: params.country.trim(),
    postcode: params.postcode.trim()
  });
};
