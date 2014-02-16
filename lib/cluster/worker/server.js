var util  = require('util');
var walve = require('walve');

function Server(options) {
  this.connections = [];

  listenToConnectEvent(this);

  walve.Server.call(this, options);
}

util.inherits(Server, walve.Server);

Server.createServer = function(listener) {
  var server = new Server()

  if (listener) {
    return server.on('connect', listener);
  } else {
    return server;
  }
};

Server.prototype.broadcast = function(chunk) {
  this.connections.forEach(function(socket) {
    var outgoing = new walve.Outgoing({
      header: { length: chunk.length }
    });

    outgoing.pipe(socket, { end: false });
    outgoing.end(chunk);
  });

  return this;
};

module.exports = Server;

function listenToConnectEvent(server) {
  server.on('connect', function(socket) {
    socket.on('message', function(incoming) {
      incoming.on('header', function(header) {
        if (header.opcode !== 0x01) return;
        if (header.length > 0x7d) return;

        var message = '';

        incoming.on('readable', function() {
          message += incoming.read().toString();
        });
        incoming.on('end', function() {
          server.emit('message', message, socket);
        });
      });
    });
    socket.on('end', function() {
      var index = server.connections.indexOf(socket);

      server.connections.splice(index, 1);
    });

    server.connections.push(socket);
  });
}
