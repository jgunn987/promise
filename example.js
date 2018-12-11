var axios = require('axios');
var Promise = require('promise');
var parsers = require('.');
var isemail = require('isemail');

function serializeSync(c, params, context) {
  return context.sync = context.sync || 
    { sync: 'sync' };
}

function serializeOne(c, params, context) {
  return context.one = context.one || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (users) {
        return { one: users.data.find(function (u, i) {
          return i === 0;    
        }).name };
      });
}

function serializeTwo(c, params, context) {
  return context.two = context.two || 
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(function (users) {
        return { two: users.data.find(function (u, i) {
          return i === 1; 
        }).name };
      });
}

function serializeBoth(c, params, context) {
  return context.both = context.both ||
    Promise.all([
      serializeOne(c, params, context),
      serializeTwo(c, params, context)
    ]).then(function (r) {
      return { both: r[0].one + ' + ' + r[1].two }; 
    });
}

function serializeCond(c, params, context) {
  return context.cond = context.cond ||
    serializeOne(c, params, context)
      .then(function (u) {
        return { cond: 
          u.one === 'Leanne Graham' && params.cond ? 'ok': undefined
        };
      });
}

function serializeCondBoth(c, params, context) {
  return context.condBoth = context.condBoth ||
    Promise.all([
      serializeOne(c, params, context), // dependency
      serializeTwo(c, params, context) // dependency
    ]).then(function (u) {
      return u[0].one === 'Leanne Graham' &&
             u[1].two === 'Leanne Graham' ?
        { condBoth: r[0].one + ' + ' + r[1].two } : 
        { condBoth: undefined };
    });
}

function serializeArray(c, params, context) {
  if(context.array) return context.array;

  return context.array = 
    Promise.all(params.array.map(function (v) {
      return v * v;
    })).then(function (r) {
      return { array: r };
    });
}

function serializeNestedObject(c, params, context) {
  if(context.nestedObject) return context.nestedObject;

  return context.nestedObject =
    serializeSomeOtherObject(c, params.nestedObject)
      .then(function (r) {
        return { nestedObject: r }; 
      });
}

function serializeArrayObjects(c, params, context) {
  if(context.arrayObjects) return context.arrayObjects;

  return context.arrayObjects = 
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
  var context = {};
  return Promise.all(fields.map(function (v) {
    return v(c, params, context);
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

function validateSync(c, params, context) {
  return context.sync = context.sync || 
    { sync: isemail.validate(params.sync || '') ?
      undefined : 'Invalid Email Address' };
}

function validateOne(c, params, context) {
  return context.one = context.one ||
    { one: undefined };
}

function validateTwo(c, params, context) {
  return context.two = context.two ||
    { two: undefined };
}

function validateBoth(c, params, context) {
  return context.both = context.both ||
    { both: undefined };
}

function validateCond(c, params, context) {
  return context.cond = context.cond ||
    { cond: undefined };
}

function validateCondBoth(c, params, context) {
  return context.condBoth = context.condBoth ||
    { condBoth: undefined };
}

function validateNestedObject(c, params, context) {
  if(context.nestedObject) return context.nestedObject;

  return context.nestedObject = 
    validateSomeOtherObject(c, params.nestedObject)
      .then(function (r) {
        return { nestedObject: r.__success ? undefined : r };    
      });
}

function validateArray(c, params, context) {
  if(context.array) return context.array;

  return context.array = 
    Promise.all(params.array.map(function (v, i) {
      return v > 2 ? undefined : 'Greater than two';
    })).then(function (r) {
      return { array: r };  
    });
}

function validateArrayObjects(c, params, context) {
  if(context.arrayObjects) return context.arrayObjects;

  return context.arrayObjects = 
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
  var context = {};
  return Promise.all(fields.map(function (v) {
    return v(c, params, context);
  })).then(parsers.parseValidationResults);
}

function validateGlobal(c, params, context) {
  if(context.validateGlobal) return context.validateGlobal;

  return context.validateGlobal = 
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
