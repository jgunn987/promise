var validateUser = require('./validateUser');
var serializeUser = require('./serializeUser');
var defaultUser = require('./defaultUser');

module.exports = function (c, params) {
  return defaultUser(c, params).then(function(user) {
    return validateUser(c, user)
      .then(function (validation) {
        if(Object.keys(validation).length) {
          throw new Error(JSON.stringify(validation));
        }
      }).then(function () {
        return serializeUser(c, params);    
      }).then(function (serialized) {
        return c.db.collection('user').insertOne(serialized);  
      }).then(function (result) {
        return result.ops[0];  
      });
  });
};
