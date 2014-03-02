var Server = require('./server');

module.exports = function(app) {

  var server = new Server();

  server.on('connect', function(socket) {
    var locations = resolveLocations(server);

    socket.on('message', function(message) {
      socket.location = message;

      server.broadcast([socket.location]);
    });
    socket.on('close', function() {
      socket.location.coordinates = null;

      server.broadcast([socket.location]);
    });

    server.broadcast(locations);
  });

  server.listen(app.server);

};

function resolveLocations(server) {
  var locations = [];

  server.sockets.forEach(function(socket) {
    if (socket.location && socket.location.id) {
      locations.push(socket.location);
    }
  });

  return locations;
}
