function parseSerializationResults(results) {
  return results.reduce(function (p, c) {
    return Object.keys(c).find(function (k) {
      return c[k];
    }) ? Object.assign(p, c) : p;
  }, {});
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function parseValidationResults(results) {
  var error = false;
  var result = results.reduce(function (p, c) {
    return Object.keys(c).filter(function (k) {
      if(isArray(c[k])) {
        c[k].forEach(function (r) {
          if (typeof r === 'object') {
            if(!r.__success) error = true;
          } else if(r) {
            error = true;
          }
        });
        return true;
      } else if (typeof c[k] === 'object') {
        error = !c[k].__success;
        return true;
      } else if (c[k]) {
        return error = true;
      }
      return error;
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
