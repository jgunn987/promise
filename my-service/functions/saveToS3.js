var Promise = require('promise');
var AWS = require('aws-sdk');

async function saveToS3(event, context) {
  console.log(event, context);
  return new AWS.S3().putObject({
    Bucket : 'hype-script',
    Key : 'yes.json',
    Body : JSON.stringify({
      message: 'yes'    
    })
  }).promise();
}

module.exports.handler = saveToS3;
