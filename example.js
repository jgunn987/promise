var axios = require('axios');
var Promise = require('promise');
var parsers = require('.');
var isemail = require('isemail');

function serializeSync(c, params, cache) {
  return cache.sync = cache.sync || 
    { sync: 'sync' };
}

function serializeOne(c, params, cache) {
  return cache.one = cache.one || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (users) {
        return { one: users.data.find(function (u, i) {
          return i === 0;    
        }).name };
      });
}

function serializeTwo(c, params, cache) {
  return cache.two = cache.two || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (users) {
        return { two: users.data.find(function (u, i) {
          return i === 1; 
        }).name };
      });
}

function serializeBoth(c, params, cache) {
  return cache.both = cache.both ||
    Promise.all([
      serializeOne(c, params, cache),
      serializeTwo(c, params, cache)
    ]).then(function (r) {
      return { both: r[0].one + ' + ' + r[1].two }; 
    });
}

function serializeCond(c, params, cache) {
  return cache.cond = cache.cond ||
    serializeOne(c, params, cache)
      .then(function (u) {
        return { cond: 
          u.one === 'Leanne Graham' && params.cond ? 'ok': undefined
        };
      });
}

function serializeCondBoth(c, params, cache) {
  return cache.condBoth = cache.condBoth ||
    Promise.all([
      serializeOne(c, params, cache), // dependency
      serializeTwo(c, params, cache) // dependency
    ]).then(function (u) {
      return u[0].one === 'Leanne Graham' &&
             u[1].two === 'Leanne Graham' ?
        { condBoth: r[0].one + ' + ' + r[1].two } : 
        { condBoth: undefined };
    });
}

function serializeArray(c, params, cache) {
  if(cache.array) return cache.array;

  return cache.array = 
    Promise.all(params.array.map(function (v) {
      return v * v;
    })).then(function (r) {
      return { array: r };
    });
}

function serializeNestedObject(c, params, cache) {
  if(cache.nestedObject) return cache.nestedObject;

  return cache.nestedObject =
    serializeSomeOtherObject(c, params.nestedObject)
      .then(function (r) {
        return { nestedObject: r }; 
      });
}

function serializeArrayObjects(c, params, cache) {
  if(cache.arrayObjects) return cache.arrayObjects;

  return cache.arrayObjects = 
    Promise.all(params.arrayObjects.map(function (v, i) {
      return serializeSomeOtherObject(c, v);
    })).then(function(a) {
      return { arrayObjects: a };
    });
}

function SerializationError(message, context) {
  var error = new Error(message);
  error.context = context;
  error.name = 'SerializationError';
  return error;
}

function serialize(c, params, fields) {
  var cache = {};
  return Promise.all(fields.map(function (v) {
    return v(c, params, cache);
  })).then(parsers.parseSerializationResults);
}

function serializeSomeOtherObject(c, params) {
  return serialize(c, params, [
    serializeSync,
    serializeOne,
    serializeTwo,
    serializeBoth,
    serializeCond,
    serializeCondBoth
  ]);
}

function serializeUsers(c, params) {
  return serialize(c, params, [
    serializeSync,
    serializeOne,
    serializeTwo,
    serializeBoth,
    serializeCond,
    serializeCondBoth,
    serializeArray,
    serializeNestedObject,
    serializeArrayObjects
  ]);
}

function validateSync(c, params, cache) {
  return cache.sync = cache.sync || 
    { sync: isemail.validate(params.sync || '') ?
      undefined : 'Invalid Email Address' };
}

function validateOne(c, params, cache) {
  return cache.one = cache.one ||
    { one: undefined };
}

function validateTwo(c, params, cache) {
  return cache.two = cache.two ||
    { two: undefined };
}

function validateBoth(c, params, cache) {
  return cache.both = cache.both ||
    { both: undefined };
}

function validateCond(c, params, cache) {
  return cache.cond = cache.cond ||
    { cond: undefined };
}

function validateCondBoth(c, params, cache) {
  return cache.condBoth = cache.condBoth ||
    { condBoth: undefined };
}

function validateNestedObject(c, params, cache) {
  if(cache.nestedObject) return cache.nestedObject;

  return cache.nestedObject = 
    validateSomeOtherObject(c, params.nestedObject)
      .then(function (r) {
        return { nestedObject: r.__success ? undefined : r };    
      });
}

function validateArray(c, params, cache) {
  if(cache.array) return cache.array;

  return cache.array = 
    Promise.all(params.array.map(function (v, i) {
      return v > 2 ? undefined : 'Greater than two';
    })).then(function (r) {
      return { array: r };  
    });
}

function validateArrayObjects(c, params, cache) {
  if(cache.arrayObjects) return cache.arrayObjects;

  return cache.arrayObjects = 
    Promise.all(params.arrayObjects.map(function (v, i) {
      return validateSomeOtherObject(c, v);
    })).then(function(a) {
      return { arrayObjects: a };
    });
}

function ValidationError(message, context) {
  var error = new Error(message);
  error.context = context;
  error.name = 'ValidationError';
  return error;
}

function validate(c, params, fields) {
  var cache = {};
  return Promise.all(fields.map(function (v) {
    return v(c, params, cache);
  })).then(parsers.parseValidationResults);
}

function validateGlobal(c, params, cache) {
  if(cache.validateGlobal) return cache.validateGlobal;

  return cache.validateGlobal = 
    Object.keys(params).length === 0 ?
      { __vglobal: 'Empty Object' } : {}
}

function validateSomeOtherObject(c, params) {
  return validate(c, params, [
    validateGlobal,
    validateSync,
    validateOne,
    validateTwo,
    validateBoth,
    validateCond,
    validateCondBoth
  ]);
}

function validateUsers(c, params) {
  return validate(c, params, [
    validateSync,
    validateOne,
    validateTwo,
    validateBoth,
    validateCond,
    validateCondBoth,
    validateNestedObject,
    validateArray,
    validateArrayObjects
  ]);
}

var data = {
  sync: 'jgunn987@gmail.com',
  array: [3, 3, 3],
  nestedObject: 99,
  arrayObjects: [{
    sync: 'jgunn987@gmail.com'
  }, {
    sync: 'jgunn987@gmail.com'
  }, {
    sync: 'jgunn987@gmail.com'
  }]
};

validateUsers({}, data).then(function (validation) {
  serializeUsers({}, data).then(function (r) {
    r._validation = validation;
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
