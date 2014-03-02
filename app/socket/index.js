var url = require('url');

module.exports = function(app) {

  app.socket = createWebSocket();

  app.socket.onopen = function(e) {
    app.emit('connect');
  };

  app.socket.onmessage = function(e) {
    app.emit('message', JSON.parse(e.data));
  };

  app.agent.on('change', function() {
	  app.socket.send(JSON.stringify(app.agent));
  });

};

function createWebSocket() {
	var object = {
		protocol: 'ws',
    hostname: location.hostname,
    port: location.port || 443
	};

	return new WebSocket(url.format(object));
}
