var validateUser = require('./validateUser');
var serializeUser = require('./serializeUser');
var defaultUser = require('./defaultUser');
var deserializeUser = require('./deserializeUser');
var model = require('./model');

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
        }).then(function (user) {
          return c.get('db').then(function (db) {
            return db.collection('user').insertOne(user);
          });
        }).then(function (result) {
          return result.ops[0]._id;  
        });
    });
}

function hasUser(c, params) {
  return c.get('db').then(function (db) {
    return db.collection('user').countDocuments({ _id: params._id })
      .then(Boolean);
  });
}

function getUser(c, params) {
  return c.get('db').then(function (db) {
    return db.collection('user').findOne({ _id: params._id });
  }).then(function (user) {
    return deserializeUser(c, user);  
  });
}

function getUsers(c, params) {
  return c.get('db').then(function (db) {
    return db.collection('user').find(params, { password: 0  }).limit(10);
  }).then(function (cursor) {
    return cursor.toArray().then(function (users) {
      return Promise.all(users.map(function (u) {
        return deserializeUser(c, u);
      }));
    });
  });
}

module.exports.createUser = createUser;
module.exports.hasUser = hasUser;
module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
