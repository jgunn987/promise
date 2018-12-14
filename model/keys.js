var Promise = require('promise');
var container = require('./container');
var uuid = require('uuid');

function parseResults(results) {
  return results.reduce(function (p, c) {
    return Object.keys(c).find(function (k) {
      return c[k];
    }) ? Object.assign(p, c) : p;
  }, {});
}

function asyncTask1(c, params) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({ email: 'jgunn987@gmail.com' });    
    }, 2000);    
  });
}

function asyncTask2(c, params) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({ name: 'james' });    
    }, 3000);    
  });
}

function asyncTask3(c, params) {
  return Promise.all([
    c.get(params._id, 'asyncTask1'),
    c.get(params._id, 'asyncTask2')
  ]).then(function (r) {
    return { 
      nameAndEmail: r[0].email + r[1].name
    };
  });
}

function subObject(c, params) {
   return address(c, params.contact)
     .then(function (r) {
       return { contact : r };
     });
}

function address(c, params) {
  return Promise.resolve({
    firstLine: params.firstLine || '9 Hadlow Road',
    secondLine: params.secondLine || 'Tonbridge',
    country: params.country || 'UK',
    postcode: params.postcode || 'tn91le'
  });
};

var c = container({});

var params = {
  _id: uuid.v4(),
  contact: {
    _id: uuid.v4()
  }
};

function user(c, params) {
  return Promise.all([
    address(c, params), 
    subObject(c, params), 
    { zero: true }, 
    c.set(params._id, 'asyncTask1', 
      asyncTask1(c, params)),
    c.set(params._id, 'asyncTask2',
      asyncTask2(c, params)),
    asyncTask3(c, params)
  ]).then(parseResults);
}
 
user(c, params)
  .then(console.log)
  .catch(console.log);

