function parseSerializationResults(results) {
  return results.reduce(function (p, c) {
    return Object.keys(c).find(function (k) {
      return c[k];
    }) ? Object.assign(p, c) : p;
  }, {});
}

function parseValidationResults(results) {
  var error = false;
  var result = results.reduce(function (p, c) {
    return Object.keys(c).filter(function (k) {
      if(c[k]) return error = true;
    }).length ? Object.assign(p, c) : p;
  }, {});

  return Object.assign(result, { 
    __success: !error
  });
}

module.exports.parseSerializationResults =
  parseSerializationResults;
module.exports.parseValidationResults =
  parseValidationResults
