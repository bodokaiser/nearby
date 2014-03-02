var lodash = require('lodash');

module.exports = function(app) {

	var agents = [];

	app('*', function(context, next) {
		context.world = createWorld(context);

		context.events.on('location', function(geometry) {
			context.world.setCenter(geometryToLatLng(geometry));
		});

		context.events.on('message', function(locations) {
      locations.forEach(function(location) {
        var agent = agents.filter(function(agent) {
          return location.id === agent.id;
        }).pop();

        if (!agent) {
          location.marker = createMarker(context, location);

          agents.push(location);
        } else {
          if (location.coordinates === null) {
            agent.marker.setMap(null);
            agents.splice(agents.indexOf(agent), 1);

            return;
          }
          if (!lodash.isEqual(agent.coordinates, location.coordinates)) {
            agent.marker.setPosition(geometryToLatLng(location));
          }
        }
      });
		});

		next();
	});

};

function createWorld(context) {
	var element = context.element;

	return new google.maps.Map(element, { zoom: 16 });
}

function createMarker(context, geometry) {
	return new google.maps.Marker({
		position: geometryToLatLng(geometry),
		map: context.world,
		draggable: true
	});
}

function geometryToLatLng(geometry) {
	var latitude = geometry.coordinates[0];
	var longitude = geometry.coordinates[1];

	return new google.maps.LatLng(latitude, longitude);
}
