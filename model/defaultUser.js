var pzone = require('./../.');

function defaultFirstName(c, params, cache) {
  return { firstName: params.firstName || 'James' };
}

function defaultLastName(c, params, cache) {
  return { lastName: params.lastName || 'Gunn' };
}

function defaultFullName(c, params, cache) {
  return pzone(c, params, [
    defaultFirstName,
    defaultLastName
  ], cache).then(function (r) {
    return { fullName: r.firstName + r.lastName };
  });
}

function defaultEmail(c, params, cache) {
  return { email: params.email || 'jgunn987@gmail.com' };
}

module.exports = function (c, params, cache) {
  return pzone(c, params, [
    defaultFirstName,
    defaultLastName,
    defaultFullName,
    defaultEmail
  ], cache);
}
