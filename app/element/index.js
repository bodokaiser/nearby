var element = document.querySelector('#map');

module.exports = app => {

  var map = createMap(element);

  // centers map to our position when moving
  app.on('position', position => {
    map.setCenter(position.toGoogleLatLng());
  });

  // renders marker on the map
  app.agents.on('push', agent => {
    agent.marker.setMap(map);
  });

  // unrenders marker from map
  app.agents.on('remove', agent => {
    agent.marker.setMap(null);
  });

};

function createMap(element) {
  var options = { zoom: 16 };

  return new google.maps.Map(element, options);
}
