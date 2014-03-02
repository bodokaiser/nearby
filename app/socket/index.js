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
	  wsocket.send(JSON.stringify(app.agent));
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
