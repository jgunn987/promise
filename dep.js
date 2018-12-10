var bunyan = require('bunyan');
var nodemailer = require('nodemailer');
var mongodb = require('mongodb');
var twilio = require('twilio');
var config = { 
  dbUri: 'localhost:27017'
};

var mailer = nodemailer.createTransport(config.smtp);

var dbConnection = mongodb.MongoClient
  .connect(c.config.dbUri, {
    useNewUrlParser: true,
    authMechanism: 'SCRAM-SHA-1'
  });

var db = dbConnection
  .then(function (db) { return db });

var log = bunyan.createLogger({
    name: c.config.logName
  });

var server = server({
  config: config,
  mailer: mailer,
  log: log,
  db: db
}, function (err, server) {
  if (err) throw err;
  server.listen(8000);
});
