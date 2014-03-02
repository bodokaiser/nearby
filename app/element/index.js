var element = document.querySelector('#map');

module.exports = function(app) {

  app.map = createWorld(element);

  app.on('position', function(position) {
    app.map.setCenter(position.toGoogleLatLng());
  });

  app.agents.on('push', function(agent) {
    agent.marker.setMap(app.map);
  });

  app.agents.on('remove', function(agent) {
    agent.marker.setMap(null);
  });

};

function createWorld(element) {
	var options = { zoom: 16 };

	return new google.maps.Map(element, options);
}
