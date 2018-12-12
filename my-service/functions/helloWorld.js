var validate = require('./../src/validate');
var isemail = require('isemail');
var Promise = require('promise');

function myPromise(res) {
  return new Promise(function (resolve, reject) {
    resolve(res);    
  });
}

async function helloWorld(event, context) {
  console.log(event, context);

  return myPromise({
    statusCode: 200,
    body: JSON.stringify({
      message: !validate() && isemail.validate('l') ? 
        'Go Serverless v1.0! Your function executed successfully!' :
        'Fuck this shit mandem, mutherfucking valdation died on a',
      input: event,
    }),
  });
}

module.exports.handler = helloWorld;
