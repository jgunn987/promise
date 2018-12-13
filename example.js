var axios = require('axios');
var Promise = require('promise');
var parsers = require('.');
var isemail = require('isemail');

function serializeSync(c, params, cache) {
  return {};
  return { sync: 'sync' };
}

function serializeOne(c, params, cache) {
  return axios.get('https://jsonplaceholder.typicode.com/users')
    .then(function (users) {
      return { one: users.data.find(function (u, i) {
        return i === 0;    
      }).name + '(' + (+new Date()) +')' };
    });
}

function serializeTwo(c, params, cache) {
  return axios.get('https://jsonplaceholder.typicode.com/users')
    .then(function (users) {
      return { two: users.data.find(function (u, i) {
        return i === 1; 
      }).name + '(' + (+new Date()) +')' };
    });
}

function serializeBoth(c, params, cache) {
  return serialize(c, params, {
    sone: serializeOne,
    stwo: serializeTwo
  }, cache).then(function (r) {
    return { both: r.one + ' + ' + r.two }; 
  });
}

function serializeCond(c, params, cache) {
  return serialize(c, params, {
    sone: serializeOne
  }, cache).then(function (u) {
    return { cond: 
      u.one === 'Leanne Graham' && params.cond ? 'ok': undefined
    };
  });
}

function serializeCondBoth(c, params, cache) {
  return serialize(c, params, {
    sone: serializeOne,
    stwo: serializeTwo
  }, cache).then(function (u) {
    return u.one === 'Leanne Graham' &&
           u.two === 'Leanne Graham' ?
      { condBoth: u.one + ' + ' + u.two } : 
      { condBoth: undefined };
  });
}

function serializeArray(c, params, cache) {
  return Promise.all(params.array.map(function (v) {
    return v * v;
  })).then(function (r) {
    return { array: r };
  });
}

function serializeNestedObject(c, params, cache) {
  return serializeSomeOtherObject(c, params.nestedObject)
    .then(function (r) {
      return { nestedObject: r }; 
    });
}

function serializeArrayObjects(c, params, cache) {
  return Promise.all(params.arrayObjects.map(function (v, i) {
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

function serializeSomeOtherObject(c, params, cache) {
  return serialize(c, params, {
    ssync: serializeSync,
    sone: serializeOne,
    stwo: serializeTwo,
    sboth: serializeBoth,
    scond: serializeCond,
    scondBoth: serializeCondBoth
  }, cache);
}

function serializeUsers(c, params, cache) {
  return serialize(c, params, {
    global: function (c, params, cache) {
      return { global: 'yes' };
    },
    ssync: serializeSync,
    sone: serializeOne,
    stwo: serializeTwo,
    sboth: serializeBoth,
    scond: serializeCond,
    scondBoth: serializeCondBoth,
    sa: serializeArray,
    sno: serializeNestedObject,
    sao: serializeArrayObjects,
    validation: validateUser
  }, cache);
}

function validateUser(c, params, cache) {
  return serialize(c, params, {
    name: function (c, params, cache) {
      return { name: 'invalid' };
    }
  }, cache).then(function (r) {
    return { validation: r };  
  });
}

function serialize(c, params, handlers, cache) {
  var cache = cache || {};
  return Promise.all(Object.keys(handlers).map(function (k) {
    return cache[k] = cache[k] || handlers[k](c, params, cache);
  })).then(parsers.parseSerializationResults);
}
/*
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
    validateSomeOtherObject(c, params.nestedObject, cache)
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
      return validateSomeOtherObject(c, v, cache);
    })).then(function(a) {
      return { arrayObjects: a };
    });
}

function validateGetParent(c, params, cache) {
  if(cache.getParent) return cache.getParent;

  return cache.getParent = 
    validateArray(c, cache.__parent.__params, cache.__parent)
      .then(function (c) {
        return { getParent: 'yo' };
      });
}

function ValidationError(message, context) {
  var error = new Error(message);
  error.context = context;
  error.name = 'ValidationError';
  return error;
}

function validate(c, params, fields, parentCache) {
  var cache = { __params: params, __parent: parentCache };
  return Promise.all(fields.map(function (v) {
    return v(c, params, cache);
  })).then(parsers.parseValidationResults);
}

function validateGlobal(c, params, cache) {
  if(cache.validateGlobal) return cache.validateGlobal;

  return cache.validateGlobal = 
    Object.keys(params).length === 0 ?
      { global: 'Empty Object' } : {}
}

function validateSomeOtherObject(c, params, cache) {
  return validate(c, params, [
    validateGlobal,
    validateSync,
    validateOne,
    validateTwo,
    validateBoth,
    validateCond,
    validateCondBoth,
    validateGetParent
  ], cache);
}

function validateUsers(c, params, cache) {
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
  ], cache);
}
*/
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

  serializeUsers({}, data).then(function (r) {
    console.log(JSON.stringify(r, null, 2));
  }).catch(console.log);
/*
validateUsers({}, data).then(function (validation) {
  serializeUsers({}, data).then(function (r) {
    console.log(JSON.stringify(Object.assign({}, r, { 
      _validation: validation
    }), null, 2))
  });
});
*/

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
