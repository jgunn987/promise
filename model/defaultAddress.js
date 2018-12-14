var pzone = require('./../.');

function defaultFirstLine(c, params, cache) {
  return { firstLine: params.firstLine || '' };
}

function defaultSecondLine(c, params, cache) {
  return { secondLine: params.secondLine || '' };
}

function defaultCountry(c, params, cache) {
  return { country: params.country || 'UK' };
}

function defaultPostcode(c, params, cache) {
  return { postcode: params.postcode };
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    defaultFirstLine,
    defaultSecondLine,
    defaultCountry,
    defaultPostcode
  ], cache);
}
