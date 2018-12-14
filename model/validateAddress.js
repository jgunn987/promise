var pzone = require('./../.');
var validCountries = [
 'United Kingdom',
 'Netherlands',
 'Germany',
 'Belgium',
 'France'
];

function validateFirstLine(c, params, cache) {
  return { firstLine: params.firstLine ? undefined : 'No first line' };
}

function validateSecondLine(c, params, cache) {
  return {};
}

function validateCountry(c, params, cache) {
  if(!params.country) 
    return { country: 'No country' };
  if(validCountries.indexOf(params.country) === -1) 
    return { country: 'Invalid country' };
  return {};
}

function validatePostcode(c, params, cache) {
  return { postcode: params.postcode ? undefined : 'No postcode' };
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    validateFirstLine,
    validateSecondLine,
    validateCountry,
    validatePostcode
  ], cache);
}
