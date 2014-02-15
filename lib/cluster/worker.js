var http  = require('http');
var walve = require('walve');

var connected = [];

module.exports = function(app) {

  var options = app.settings.server;

  app.server = http.createServer(app);
  app.server.listen(options.port);

  walve.createServer(function(wsocket) {

    connected.push(wsocket);

		wsocket.on('message', function(incoming) {
      var message = '';

      incoming.on('readable', function() {
        message += incoming.read().toString();
      });
      incoming.on('end', function() {
        wsocket.location = JSON.parse(message);

        broadcast(getLocations(), wsocket);
      });
    });
    wsocket.on('end', function() {
      var index = connected.indexOf(wsocket);

      connect.splice(index, 1);
    });

    broadcast(getLocations(), wsocket);

  }).listen(app.server);

};

function broadcast(object, socket) {
  var message = JSON.stringify(object);

  var outgoing = new walve.Outgoing({
    header: { length: message.length }
  });

  outgoing.pipe(socket, { end: false });
  outgoing.end(message);

  return outgoing;
}

function getLocations() {
  return connected.map(function(connect) {
    return connect.location;
  });
}
