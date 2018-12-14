var Promise = require('promise');
var EventEmitter = require('events');

function Container(c) {
  c = c || {};
  this.timeout = c.timeout || 15000;
  this.events = new EventEmitter();
  this.store = {};
}

Container.prototype.set = function (k, v) {
  var container = this;
  return this.store[k] = Promise.resolve(v).then(function (r) {
    container.events.emit(k, r);    
    return r;
  });
};

Container.prototype.get = function (k) {
  var container = this;
  return new Promise(function (resolve, reject) {
    if(k in container.store) {
      return container.store[k].then(resolve); 
    }

    container.events.on(k, resolve);

    setTimeout(function () {
      reject(new Error(k + ': Operation timeout exceeded'));    
    }, container.timeout);
  });
};

Container.prototype.del = function (k) {
  delete this.store[k];
};

module.exports = function (c) {
  return new Container(c);
};
