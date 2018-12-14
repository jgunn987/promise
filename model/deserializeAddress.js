var pzone = require('./../.');

function deserializeFirstLine(c, params) {
  return { firstLine: params.firstLine };
}

function deserializeSecondLine(c, params) {
  return { secondLine: params.secondLine };
}

function deserializeCountry(c, params) {
  return { country: params.country };
}

function deserializePostcode(c, params) {
  return { postcode: params.postcode };
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    deserializeFirstLine,
    deserializeSecondLine, 
    deserializeCountry,
    deserializePostcode
  ], cache);
};
