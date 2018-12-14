module.exports = function (array) {
  return array.find(function (v) {
    return !!v;
  }) ? array : undefined;
};
