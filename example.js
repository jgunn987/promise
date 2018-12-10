var axios = require('axios');
var Promise = require('promise');
var parsers = require('.');
var isemail = require('isemail');

function serializeSync(c, params, result) {
  return result.sync = result.sync || { sync: 'sync' };
}

function serializeOne(c, params, result) {
  return result.one = result.one || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (users) {
        return { one: users.data.find(function (u, i) {
          return i === 0;    
        }).name };
      });
}

function serializeTwo(c, params, result) {
  return result.two = result.two || 
    axios.get('https://jsonplaceholder.typicode.com/users')
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

function serializeArray(c, params, result) {
  if(result.array) return result.array;
  return result.array = 
    Promise.all(params.array.map(function (v) {
      return v * v;
    })).then(function (r) {
      return { array: r };
    });
}

function serializeNestedObject(c, params, result) {
  if(result.nestedObject) return result.nestedObject;
  return result.nestedObject =
    serializeSomeOtherObject(c, params.nestedObject)
      .then(function (r) {
        return { nestedObject: r }; 
      });
}

function serializeArrayObjects(c, params, result) {
  if(result.arrayObjects) return result.arrayObjects;
  return result.arrayObjects = 
    Promise.all(params.arrayObjects.map(function (v, i) {
      return serializeSomeOtherObject(c, v);
    })).then(function(a) {
      return { arrayObjects: a };
    });
}

function SerializationError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'SerializationError';
  return error;
}

function serializeSomeOtherObject(c, params) {
  var result = {};
  return Promise.all([
    serializeSync(c, params, result),
    serializeOne(c, params, result),
    serializeTwo(c, params, result),
    serializeBoth(c, params, result),
    serializeCond(c, params, result),
    serializeCondBoth(c, params, result)
  ]).then(parsers.parseSerializationResults);
}

function serializeUsers(c, params) {
  var result = {};
  return Promise.all([
    serializeSync(c, params, result),
    serializeOne(c, params, result),
    serializeTwo(c, params, result),
    serializeBoth(c, params, result),
    serializeCond(c, params, result),
    serializeCondBoth(c, params, result),
    serializeArray(c, params, result),
    serializeNestedObject(c, params, result),
    serializeArrayObjects(c, params, result)
  ]).then(parsers.parseSerializationResults);
}

function validateSync(c, params, result) {
  return result.sync = result.sync || 
    { sync: isemail.validate(params.sync || '') ?
      undefined : 'Invalid Email Address' };
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

function validateNestedObject(c, params, result) {
  if(result.nestedObject) return result.nestedObject;
  return result.nestedObject = 
    validateSomeOtherObject(c, params.nestedObject)
      .then(function (r) {
        return { nestedObject: r.__success ? undefined : r };    
      });
}

function validateArray(c, params, result) {
  if(result.array) return result.array;
  return result.array = 
    Promise.all(params.array.map(function (v, i) {
      return v > 2 ? undefined : 'Greater than two';
    })).then(function (r) {
      return { array: r };  
    });
}

function validateArrayObjects(c, params, result) {
  if(result.arrayObjects) return result.arrayObjects;
  return result.arrayObjects = 
    Promise.all(params.arrayObjects.map(function (v, i) {
      return validateSomeOtherObject(c, v);
    })).then(function(a) {
      return { arrayObjects: a };
    });
}

function ValidationError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'ValidationError';
  return error;
}

function validateSomeOtherObject(c, params) {
  var result = {};
  return Promise.all([
    validateSync(c, params, result),
    validateOne(c, params, result),
    validateTwo(c, params, result),
    validateBoth(c, params, result),
    validateCond(c, params, result),
    validateCondBoth(c, params, result),
  ]).then(parsers.parseValidationResults);
}

function validateUsers(c, params) {
  var result = {};
  return Promise.all([
    validateSync(c, params, result),
    validateOne(c, params, result),
    validateTwo(c, params, result),
    validateBoth(c, params, result),
    validateCond(c, params, result),
    validateCondBoth(c, params, result),
    validateNestedObject(c, params, result),
    validateArray(c, params, result),
    validateArrayObjects(c, params, result)
  ]).then(parsers.parseValidationResults);
}

var data = {
  sync: 'jgunn987@gmail.com',
  array: [3, 3, 3],
  nestedObject: {
    sync: 'jgunn987@gmail.com'
  },
  arrayObjects: [{
    sync: 'jgunn987@gmail.com'
  }, {
    sync: 'jgunn987@gmail.com'
  }, {
    sync: 'jgunn987@gmail.com'
  }]
};

validateUsers({}, data).then(function (r) {
  console.log(JSON.stringify(r, null, 2));
  serializeUsers({}, data).then(function (r) {
    console.log(JSON.stringify(r, null, 2));
  });
});

function createUsers(c, params) {
  validateUsers(c, params)
    .then(function (result) {
      if(!result.__valid) {
        throw new ValidationError('Invalid User', result);
      }

      return serializeUsers(c, params);
    }).then(function (r) {
      return c.db.then(function (db) {
        return db.collection('user').insertOne(model.user(r));
      }).then(function (r) {
        return c.events.emit({
          action: 'Create User'    
        });  
      });
    });
}
