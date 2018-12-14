var Promise = require('promise');
var EventEmitter = require('events');

module.exports = function container(config) {
  var timeout = config.timeout || 15000;
  var events = new EventEmitter();
  var store = {};

  function set(bucket, k, v) {
    store[bucket] = store[bucket] || {};
    return store[bucket][k] = Promise.resolve(v).then(function (r) {
      events.emit(bucket + '/' + k, r);    
      return r;
    });
  }

  function get(bucket, k) {
    return new Promise(function (resolve, reject) {
      if(bucket in store && k in store[bucket]) {
        return store[bucket][k].then(resolve); 
      }

      var eventKey = bucket + '/' + k;
      events.on(eventKey, resolve);

      setTimeout(function () {
        reject(new Error(eventKey + ': Operation timeout exceeded'));    
      }, timeout);
    });
  }

  return {
    set: set,
    get: get
  };
};
