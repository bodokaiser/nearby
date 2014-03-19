var url = require('url');

module.exports = function(app) {

  var wsocket = createWebSocket();

  wsocket.onopen = function(e) {
    app.emit('connect');
  };

  wsocket.onmessage = function(e) {
    app.emit('message', JSON.parse(e.data));
  };

  app.agent.on('change', function() {
    // each time our agent changes (in geometry)
    // we want to inform the server for a broadcast
    wsocket.send(JSON.stringify(app.agent));
  });

};

function createWebSocket() {
  var object = {
    protocol: 'ws',
    hostname: location.hostname,
    // on my production environment I have a reverse proxy in front
    // which will take upgrade requests from 443 to allow mobile use
    // of websockets (else they will get blocked by cellular proxy)
    port: location.port || 443
  };

  return new WebSocket(url.format(object));
}
