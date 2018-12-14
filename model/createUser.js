var validateUser = require('./validateUser');
var serializeUser = require('./serializeUser');
var defaultUser = require('./defaultUser');
var deserializeUser = require('./deserializeUser');
var model = require('./model');
var uuid = require('uuid');

function createUser(c, params) {
  return defaultUser(c, model(params))
    .then(function(user) {
      return validateUser(c, user)
        .then(function (validation) {
          if(Object.keys(validation).length) {
            throw new Error(JSON.stringify(validation));
          }

        }).then(function () {
          return serializeUser(c, user); 
        });
    });

}

module.exports = function (c, params) {
  return createUser(c, params)
    .then(function (user) {
      return c.get('*', 'db').then(function (db) {
        return db.collection('user').insertOne(user);
      });
    }).then(function (result) {
      return result.ops[0];  
    }).then(function (data) {
      return deserializeUser(c, data);
    });
};
