module.exports = function (obj) {
  return Object.keys(obj).find(function(k) {
    return obj[k] !== undefined;
  }) ? false : true;
};
