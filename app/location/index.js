var Position = require('../models/position');

module.exports = function(app) {

  app.once('connect', function() {
    navigator.geolocation.getCurrentPosition(update);
    navigator.geolocation.watchPosition(update);
  });

  function update(location) {
    var position = new Position().setFromNavigator(location);

    app.emit('position', position);
  }

};
