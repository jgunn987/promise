var net = require('net');

function rpcServer(c, params) {
  var server = net.createServer(function(socket) {
    socket.on('data', function (data) {
      var message = JSON.parse(data);
      socket.write(JSON.stringify({ id: message.id, error: true }));
    });

    socket.on('end', function () {
      console.log('end');
    });
  });

  server.listen(Number(params.port), params.host.toString()); 

  return server;
}
