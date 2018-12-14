function parseObjectKeys(results) {
  return results.reduce(function (p, c) {
    return Object.keys(c).find(function (k) {
      return c[k];
    }) ? Object.assign(p, c) : p;
  }, {});
}

module.exports = parseObjectKeys;
