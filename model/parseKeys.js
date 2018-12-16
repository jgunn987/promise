function parseKeys(results) {
  return results.reduce(function (p, c) {
    return Object.keys(c).find(function (k) {
      return c[k] !== undefined;
    }) ? Object.assign(p, c) : p;
  }, {});
}

module.exports = parseKeys;
