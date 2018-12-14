Promise = require('promise');

module.exports = function (c, params) {
  return Promise.resolve({
    _id: params._id,
    firstLine: params.firstLine || '',
    secondLine: params.secondLine || '',
    country: params.country || 'UK',
    postcode: params.postcode
  });
}
