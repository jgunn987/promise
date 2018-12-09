var axios = require('axios');
var Promise = require('promise');

Promise.object = function (o) {
  var index = Object.keys(o);

  return Promise.all(index.map(function (k) {
    return o[k];    
  })).then(function(r) {
    return r.reduce(function (p, c, i) {
      var or = {};
      or[index[i]] = c;
      return Object.assign(p, or);
    }, {});
  });
};

Promise.object({
  a: 1    
}).then(console.log);

function SerializationError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'SerializationError';
  return error;
}

function ValidationError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'ValidationError';
  return error;
}

function RpcError(message, result) {
  var error = new Error(message);
  error.result = result;
  error.name = 'RpcError';
  return error;
}

function serialize(params, e) {
  return Promise.all(params)
    .then(function (r) {
      if (e) throw new SerializationError('Unable to serialize field');
      return r.reduce(function (p, c) {
        return Object.assign(p, c);
      }, {});
    }).catch(function(err) {
      throw err;
    });
}

function rpc(method, params, e) {
  return new Promise(function (resolve, reject) {
    !e ? resolve(params) :
      reject(new RpcError('Invalid request'));
  });
}

function created(params) {
  console.log(params);
}

function error(err) {
  throw err;
}

function serializePatientHidden() {
  return new Promise(function (resolve, reject) {
    resolve({ patient: 99 });
  });
}

function serializeField(k) {
  var o = {};
  o[k] = k.length;
  return o;
}

function createLeaveContractForm(params) {
  return dom('form', {
    id: 'create-leave-contract-form'
  }, [
    field.patientHidden(params),
    field.leaveType(params),
    field.leaveFrequency(params),
    field.leaveFrequencyType(params),
    field.durationMinutes(params),
    field.durationHours(params),
    field.durationDays(params),
    field.numEscorts(params),
    field.location(params),
    field.submit(params)
  ], {
    submit: createLeaveContractAction(params)
  });
}

function createLeaveContractAction(params) {
  return serializeLeaveContract(params)
    .then(function (result) {
      return rpc('createLeaveContract', result);    
    }).then(function (result) {
      return created({
        result: result,
        message: 'Created'
      }); 
    }).catch(function (err) {
      switch(err.name) {
        case 'SerializationError':
          console.log(err.message);
          break;
        case 'RpcError':
          console.log(err.message);
          break;
      }
      return error({ 
        result: result,
        message: 'error'
      });
    });
}
axios.get('httg:.//gggg.cool.ski.()').catch(console.log);
createLeaveContractAction({ a: 1, b: 2, c: 3 })
  .then(function (r) { console.log(100) })

function createUser(c, params) {
  validateUser(params).then(function() {
    serializeUser(params).then(function (results) {
      return c.db.collection('user')
        .insertOne(model.user({
          name: params.name,
          email: params.email,
          password: deps.password,
          role: params.role,
          NHSNO: params.NHSNO
        }));
    });
  });
}

createUser.permissions = ['CreateUser'];
