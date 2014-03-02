var uuid = require('uuid');

module.exports = function(app) {

  app.id = uuid.v4();

	app('/', function(context, next) {
		context.events.on('connected', function() {
			navigator.geolocation.getCurrentPosition(updateSocket);
			navigator.geolocation.watchPosition(updateSocket);
		});

		function updateSocket(position) {
      var location = positionToGeometry(position);

      location.id = app.id;

			context.events.emit('location', location);
		}
	});

};

function positionToGeometry(position) {
	var geometry = { type: 'Point', coordinates: [] };

	geometry.coordinates.push(position.coords.latitude);
	geometry.coordinates.push(position.coords.longitude);

	return geometry;
}
