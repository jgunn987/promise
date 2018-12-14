var validateUser = require('./validateUser');
var serializeUser = require('./serializeUser');
var defaultUser = require('./defaultUser');
var deserializeUser = require('./deserializeUser');
var uuid = require('uuid');

module.exports = function (c, params) {
  return defaultUser(c, 
    Object.assign(params, { 
      _id: uuid.v4() 
    }))
    .then(function(user) {
        console.log(user);
      return validateUser(c, user)
        .then(function (validation) {
          if(Object.keys(validation).length) {
            throw new Error(JSON.stringify(validation));
          }

//        }).then(function () {
//          return serializeUser(c, user); 
        }).then(function (serialized) {
          return c.get('*', 'db').then(function (db) {
            return db.collection('user').insertOne(user);
          });
        }).then(function (result) {
          return result.ops[0];  
//        }).then(function (data) {
//          return deserializeUser(c, data);
        });
    });
};
