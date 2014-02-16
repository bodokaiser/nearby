var http  = require('http');

var Server = require('./server');

module.exports = function(app) {

  var options = app.settings.server;

  var server = new http.Server();
  server.on('request', app);
  server.listen(options.port);

  var wserver = new Server();
  wserver.on('connect', function(socket) {
    wserver.broadcast(JSON.stringify(getLocations(wserver)));
  });
  wserver.on('message', function(message, socket) {
    socket.location = JSON.parse(message);

    wserver.broadcast(JSON.stringify(getLocations(wserver)));
  });
  wserver.listen(server);

};

function getLocations(wserver) {
  return wserver.connections.map(function(socket) {
    if (!socket.location) return;

    return socket.location;
  });
}
