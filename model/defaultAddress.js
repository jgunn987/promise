Promise = require('promise');

module.exports = function (c, params) {
  return Promise.resolve({
    firstLine: params.firstLine || '',
    secondLine: params.secondLine || '',
    country: params.country || 'UK',
    postcode: params.postcode
  });
}
