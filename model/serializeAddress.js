var pzone = require('./../.');

function serializeFirstLine(c, params, cache) {
  return { firstLine: params.firstLine.trim() };
}

function serializeSecondLine(c, params, cache) {
  return { secondLine: params.secondLine.trim() };
}

function serializeCountry(c, params, cache) {
  return { country: params.country.trim() };
}

function serializePostcode(c, params, cache) {
  return { postcode: params.postcode.trim() };
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    serializeFirstLine,
    serializeSecondLine,
    serializeCountry,
    serializePostcode
  ], cache);
}
