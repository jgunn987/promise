var mongodb = require('mongodb');
var container = require('./container');
var createUser = require('./createUser');

var c = container({});

c.set('*', 'db', 
  mongodb.MongoClient
    .connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then(function (client) { 
      return client.db('promise-test');
    }));

createUser(c, {
  firstName: 'Timothy',
  lastName: 'Goon',
  email: 'universal@gumbo.net',
  address: {
    firstLine: '9 Hadlow Road',
    secondLine: 'Tonbridge',
    country: 'United Kingdom',
    postcode: 'TN91LE'
  },
  subscriptions: [{
    user: 'Timothy',
    events: ['email']
  }, {}]
}).then(console.log)
  .catch(function (err) {
    console.log(err);  
  });
