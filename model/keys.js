var Promise = require('promise');
var messageQueue = require('./messageQueue');
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
    c.queue.wait(params._id, 'addressFields'),
    c.queue.wait(params._id, 'asyncTaskZero'),
    c.queue.wait(params._id, 'asyncTask1'),
    c.queue.wait(params._id, 'asyncTask2')
  ]).then(function (r) {
    return { 
      addressLine: r[0].firstLine + r[0].secondLine,
      nameAndEmail: r[2].email + r[3].name
    };
  });
}

function address(c, params, cache) {
  return Promise.resolve({
    firstLine: params.firstLine || '9 Hadlow Road',
    secondLine: params.secondLine || 'Tonbridge',
    country: params.country || 'UK',
    postcode: params.postcode || 'tn91le'
  });
};

var c = {
  queue: messageQueue({})
};
var params = {
  _id: uuid.v4()
};

c.queue.push(params._id, 'ALL',
  Promise.all([
    c.queue.push(params._id, 'addressFields', 
      address(c, params)), 
    c.queue.push(params._id, 'asyncTaskZero', 
      { zero: true }), 
    c.queue.push(params._id, 'asyncTask1', 
      asyncTask1(c, params)),
    c.queue.push(params._id, 'asyncTask2',
      asyncTask2(c, params)),
    c.queue.push(params._id, 'asyncTask3', 
      asyncTask3(c, params))
  ]));
  
c.queue.wait(params._id, 'ALL')
  .then(parseResults)
  .then(console.log)
  .catch(console.log);

