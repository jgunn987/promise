var axios = require('axios');
var Promise = require('bluebird');

function serializeSync(c, params, result) {
  return result.sync = result.sync || { sync: 'sync' };
}

function serializeOne(c, params, result) {
  return result.one = result.one || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (r) { console.log('two called'); return r; })
      .then(function (users) {
        return { one: users.data.find(function (u, i) {
          return i === 0;    
        }).name };
      });
}

function serializeTwo(c, params, result) {
  return result.two = result.two || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (r) { console.log('one called'); return r; })
      .then(function (users) {
        return { two: users.data.find(function (u, i) {
          return i === 1; 
        }).name };
      });
}

function serializeBoth(c, params, result) {
  return result.both = result.both ||
    Promise.all([
      serializeOne(c, params, result),
      serializeTwo(c, params, result)
    ]).then(function (r) {
      return { both: r[0].one + ' + ' + r[1].two }; 
    });
}

function serializeCond(c, params, result) {
  return result.cond = result.cond ||
    serializeOne(c, params, result)
      .then(function (u) {
        return { cond: 
          u.one === 'Leanne Graham' && params.cond ? 'ok': undefined
        };
      });
}

function serializeCondBoth(c, params, result) {
  return result.condBoth = result.condBoth ||
    Promise.all([
      serializeOne(c, params, result), // condition
      serializeTwo(c, params, result) // condition
    ]).then(function (u) {
      return u[0].one === 'Leanne Graham' &&
             u[1].two === 'Leanne Graham' ?

        Promise.all([ // dependencies
          serializeOne(c, params, result),
          serializeTwo(c, params, result)
        ]).then(function (r) {
          return { condBoth: r[0].one + ' + ' + r[1].two }; 
        }) : { condBoth: undefined };
    });
}

function SerializationError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'SerializationError';
  return error;
}

function parseSerializationResults(results) {
  return results.reduce(function (p, c) {
    return Object.keys(c).find(function (k) {
      return c[k];
    }) ? Object.assign(p, c) : p;
  }, {});
}

function serializeUsers(c, params) {
  var result = {};
  return Promise.all([
    serializeSync(c, params, result),
    serializeOne(c, params, result),
    serializeTwo(c, params, result),
    serializeBoth(c, params, result),
    serializeCond(c, params, result),
    serializeCondBoth(c, params, result)
  ]).then(parseSerializationResults);
}

function validateSync(c, params, result) {
  return result.sync = result.sync || 
    { sync: 'No Sync Parameter' };
}
function validateOne(c, params, result) {
  return result.one = result.one ||
    { one: undefined };
}
function validateTwo(c, params, result) {
  return result.two = result.two ||
    { two: undefined };
}
function validateBoth(c, params, result) {
  return result.both = result.both ||
    { both: undefined };
}
function validateCond(c, params, result) {
  return result.cond = result.cond ||
    { cond: undefined };
}
function validateCondBoth(c, params, result) {
  return result.condBoth = result.condBoth ||
    { condBoth: undefined };
}

function ValidationError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'ValidationError';
  return error;
}

function parseValidationResults(results) {
  var hasError = false;
  var result = results.reduce(function (p, c) {
    return Object.keys(c).filter(function (k) {
      if(c[k]) return hasError = true;
    }).length ? Object.assign(p, c) : p;
  }, {});

  if(hasError) {
    throw new ValidationError('Invalid User', result);
  } else {
    return {};
  }
}

function validateUsers(c, params) {
  var result = {};
  return Promise.all([
    { sync: undefined }
/*
    validateSync(c, params, result),
    validateOne(c, params, result),
    validateTwo(c, params, result),
    validateBoth(c, params, result),
    validateCond(c, params, result),
    validateCondBoth(c, params, result)
*/
  ]).then(parseValidationResults);
}


function createUsers(c, params) {
  return serializeUsers({}, {})
    .then(function (r) {
      return validateUsers({}, {})
        .then(function () {
          return axios.post('someendpoint', r);
        });
    });
}

createUsers({}, {});
