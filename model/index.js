var mongodb = require('mongodb');
var container = require('./container');
var methods = require('./createUser');
var c = container();

c.set('db', 
  mongodb.MongoClient
    .connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then(function (client) { 
      c.set('dbConn', client);
      return client.db('promise-test');
    }));

cc = c.extend();

methods.createUser(cc, {
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
}).then(function (_id) {
    //methods.getUser(c, { _id: _id }).then(console.log);
    //methods.getUsers(c, {}).then(console.log);
    methods.hasUser(cc, { _id: _id }).then(console.log);
  }).catch(function (err) {
    console.log(err);
    process.exit(0);
  });
