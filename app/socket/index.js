var url = require('url');

module.exports = function(app) {

	app('*', function(context, next) {
		context.wsocket = createWebSocket();

		context.wsocket.addEventListener('open', function() {
			context.events.emit('connected');
		});
		context.wsocket.addEventListener('message', function(e) {
			context.events.emit('message', JSON.parse(e.data));
		});

		context.events.on('location', function(geometry) {
			context.wsocket.send(JSON.stringify(geometry));
		});

		next();
	});

};

function createWebSocket(app) {
	var resource = url.format({
		protocol: 'ws',
		host: location.host
	});

	return new WebSocket(resource);
}
