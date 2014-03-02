var util   = require('util');
var walve  = require('walve');

function Server(options) {
  this.sockets = [];

  listenToConnectEvent(this);

  walve.Server.call(this, options);
}

util.inherits(Server, walve.Server);

Server.prototype.broadcast = function(object) {
  var message = JSON.stringify(object);

  this.sockets.forEach(function(socket) {
    var outgoing = new walve.Outgoing({
      header: { length: message.length }
    });

    outgoing.pipe(socket, { end: false });
    outgoing.end(message);
  });

  return this;
};

module.exports = Server;

function listenToConnectEvent(server) {
  server.on('connect', function(socket) {
    socket.on('incoming', function(incoming) {
      if (incoming.header.length > 0xffff) return;

      var message = '';
      incoming.on('readable', function() {
        message += incoming.read().toString();
      });
      incoming.on('end', function() {
        socket.emit('message', JSON.parse(message));
      });
    });
    socket.on('close', function() {
      var index = server.sockets.indexOf(socket);

      server.sockets.splice(index, 1);
    });

    server.sockets.push(socket);
  });
}
