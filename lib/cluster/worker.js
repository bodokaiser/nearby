var http      = require('http');
var mongoose  = require('mongoose');
var websocket = require('websocket-x');
	
var Location = mongoose.model('Location');

module.exports = function(app) {

  var options = app.settings.server;

  app.server = http.createServer(app);
  app.server.listen(options.port);

  websocket.createServer(function(wssocket, wsserver) {

		var location = new Location();

		wssocket.addListener('message', updateAndBroadcast);
		wssocket.addListener('close', removeAndBroadcast);
		wssocket.addListener('end', removeAndBroadcast);

		function updateAndBroadcast(incoming) {
			bufferIncoming(incoming, function(buffer) {
				var message = JSON.parse(buffer.toString());

				location.updateGeometryAndFindAll(message, function(err, locations) {
					if (err) return;

					var message = locationsToMessage(locations);

					wsserver.broadcast(message);
				});
			});
		}

		function removeAndBroadcast() {
			location.removeAndFindAll(function(err, locations) {
				if (err) return;

				var message = locationsToMessage(locations);

				wsserver.broadcast(message);
			});
    }

  }).listen(app.server);

};

function bufferIncoming(incoming, callback) {
	var buffer = [];

	incoming.addListener('readable', function() {
		buffer.push(incoming.read());
	});
	incoming.addListener('end', function() {
		callback(Buffer.concat(buffer));
	});
}

function locationsToMessage(locations) {
	var geometries = locations.map(function(location) {
		return location.geometry;
	});

	return JSON.stringify(geometries);
}
