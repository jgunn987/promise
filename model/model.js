var uuid = require('uuid');

module.exports = function (obj, parentObj) {
  return Object.assign({}, obj, {
    _parent: parentObj,
    _id: obj._id || uuid.v4()    
  });
};
