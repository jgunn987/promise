var Promise = require('promise');
var parseResults = require('./parseResults');
var validCountries = [
 'United Kingdom',
 'Netherlands',
 'Germany',
 'Belgium',
 'France'
];

function validateFirstLine(c, params) {
  return Promise.resolve({ 
    firstLine: params.firstLine ? undefined : 'No first line'
  });
}

function validateCountry(c, params) {
  if(!params.country) 
    return Promise.resolve({ country: 'No country' });
  if(validCountries.indexOf(params.country) === -1) 
    return Promise.resolve({ country: 'Invalid country' });
  return Promise.resolve({});
}

function validatePostcode(c, params) {
  return Promise.resolve({ 
    postcode: params.postcode ? undefined : 'No postcode'
  });
}

module.exports = function (c, params) {
  return Promise.all([
    validateFirstLine(c, params),
    validateCountry(c, params),
    validatePostcode(c, params)
  ]).then(parseResults);
}
