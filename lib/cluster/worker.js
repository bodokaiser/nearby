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

        broadcast(getLocations());
      });
    });

    wsocket.on('end', function() {
      var index = connected.indexOf(wsocket);

      connected.splice(index, 1);

      broadcast(getLocations());
    });

    broadcast(getLocations());

  }).listen(app.server);

};

function broadcast(object) {
  var message = JSON.stringify(object);

  connected.forEach(function(wsocket) {
    var outgoing = new walve.Outgoing({
      header: { length: message.length }
    });

    outgoing.pipe(wsocket, { end: false });
    outgoing.end(message);
  });
}

function getLocations() {
  return connected.map(function(connect) {
    if (!connect.location) return;

    return connect.location;
  });
}
