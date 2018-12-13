var createUser = require('./createUser');
var mongodb = require('mongodb');

mongodb.MongoClient
  .connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
  }).then(function (client) { 
    return createUser({ db: client.db('promise-test') }, {
      firstName: 'Timothy',
      email: 'universal@gumbo.net'
    });
  }).then(console.log)
    .catch(function (err) {
      console.log(err);  
    });
