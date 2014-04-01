var util   = require('util');
var walve  = require('walve');

function Server(options) {
  // store connected sockets
  this.sockets = [];

  // apply api sugar on connect
  listenToConnectEvent(this);

  walve.Server.call(this, options);
}

util.inherits(Server, walve.Server);

Server.prototype.send = function(object, socket) {
  var message = JSON.stringify(object);

  var outgoing = new walve.Outgoing({
    header: { length: message.length }
  });

  outgoing.pipe(socket, { end: false });
  outgoing.end(message);

  return this;
};

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
  var sockets = server.sockets;

  server.on('connect', function(socket) {
    socket.on('incoming', function(incoming) {
      // secures server from beeing flooded by too large frames
      // most messages will be below 0x7e in length
      if (incoming.header.length > 0xffff) {
        return socket.end();
      }

      // cache frame payload to be parsed as JSON
      var message = '';
      incoming.on('readable', function() {
        message += incoming.read().toString();
      });
      incoming.on('end', function() {
        socket.emit('message', JSON.parse(message));
      });
    });
    socket.on('close', function() {
      // remove sockets on disconnect so we do not waste
      // any resources when broadcasting
      sockets.splice(sockets.indexOf(socket), 1);
    });

    // add socket to our collection
    sockets.push(socket);
  });
}
