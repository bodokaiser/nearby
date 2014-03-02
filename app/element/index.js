var element = document.querySelector('#map');

module.exports = function(app) {

  var map = createMap(element);

  // centers map to our position when moving
  app.on('position', function(position) {
    map.setCenter(position.toGoogleLatLng());
  });

  // renders marker on the map
  app.agents.on('push', function(agent) {
    agent.marker.setMap(map);
  });

  // unrenders marker from map
  app.agents.on('remove', function(agent) {
    agent.marker.setMap(null);
  });

};

function createMap(element) {
	var options = { zoom: 16 };

	return new google.maps.Map(element, options);
}
