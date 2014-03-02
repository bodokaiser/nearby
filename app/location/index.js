var Position = require('../models/position');

module.exports = function(app) {

  app.once('connect', function() {
    // start geolocation request on web socket connection background of this
    // is that all markers are rendered on websocket message even our own one
    navigator.geolocation.getCurrentPosition(update);
    navigator.geolocation.watchPosition(update);
  });

  function update(location) {
    // map the location format to our Position model
    var position = new Position().setFromNavigator(location);

    app.emit('position', position);
  }

};
