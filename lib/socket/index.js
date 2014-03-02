// we extended walve.Server to add some API sugar
var Server = require('./server');

module.exports = function(app) {

  var server = new Server();

  server.on('connect', function(socket) {
    // on connect we want to share all agents with new socket
    var agents = resolveAgents(server);

    // replace agent information by client message
    socket.on('message', function(message) {
      socket.agent = message;

      server.broadcast([socket.agent]);
    });

    // set geometry to null to mark agent as closed
    socket.on('close', function() {
      if (!socket.agent) return;

      socket.agent.geometry = null;

      server.broadcast([socket.agent]);
    });

    // send all resolved agents to new socket
    server.send(agents, socket);
  });

  // bind to http server for "upgrade"
  server.listen(app.server);

};

// basically just creates an array with all
// valid agent properties of agents
function resolveAgents(server) {
  var agents = [];

  server.sockets.forEach(function(socket) {
    if (socket.agent && socket.agent.uuid) {
      agents.push(socket.agent);
    }
  });

  return agents;
}
