var validateUser = require('./validateUser');
var serializeUser = require('./serializeUser');
var deserializeUser = require('./deserializeUser');

module.exports = function (c, params) {
  return validateUser(c, params)
    .then(function (validation) {
      if(Object.keys(validation).length) {
        throw new Error(JSON.stringify(validation));
      }

    }).then(function () {
      return serializeUser(c, params);    
    }).then(function (serialized) {
      return c.db.collection('user').updateOne({
        _id: serialized._id    
      }, serialized);  
    }).then(function (result) {
      return result.ops[0];  
    }).then(function (data) {
      return deserializeUser(c, data);
    });
};
