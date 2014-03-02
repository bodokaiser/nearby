var element = document.querySelector('#map');

module.exports = function(app) {

  var map = createMap(element);

  app.on('position', function(position) {
    map.setCenter(position.toGoogleLatLng());
  });

  app.agents.on('push', function(agent) {
    agent.marker.setMap(map);
  });

  app.agents.on('remove', function(agent) {
    agent.marker.setMap(null);
  });

};

function createMap(element) {
	var options = { zoom: 16 };

	return new google.maps.Map(element, options);
}
