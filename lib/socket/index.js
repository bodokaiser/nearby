var Server = require('./server');

module.exports = function(app) {

  var server = new Server();

  server.on('connect', function(socket) {
    var agents = resolveAgents(server);

    socket.on('message', function(message) {
      socket.agent = message;

      server.broadcast([socket.agent]);
    });

    socket.on('close', function() {
      if (!socket.agent) return;

      socket.agent.geometry = null;

      server.broadcast([socket.agent]);
    });

    server.broadcast(agents);
  });

  server.listen(app.server);

};

function resolveAgents(server) {
  var agents = [];

  server.sockets.forEach(function(socket) {
    if (socket.agent && socket.agent.uuid) {
      agents.push(socket.agent);
    }
  });

  return agents;
}
