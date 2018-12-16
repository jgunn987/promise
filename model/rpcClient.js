var net = require('net');
var uuid = require('uuid');

function rpcClient(c, params) {
  var client = new net.Socket();
  var requests = {};

  client.connect(Number(params.port), params.host.toString(), function() {
    console.log('Connected');
  });

  client.on('error', function (err) {
    client.destroy();
    throw err;    
  });

  client.on('data', function(data) {
    var message = JSON.parse(data);
    if(message.id in requests) {
      requests[message.id].resolve(message);
    }
  });

  client.on('close', function() {
    console.log('Connection closed');
  });

  var write = client.write;
  client.invoke = function (method, params) {
    var id = uuid.v4();

    return new Promise(function (resolve, reject) {
      requests[id] = {
        resolve: resolve,
        reject: reject
      };

      write.call(client, (JSON.stringify({
        'jsonrpc': '2.0',
        'method': method.toString(),
        'params': params,
        'id': id
      })));
    });
  };

  return client;
}

