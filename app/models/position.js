var util    = require('util');
var exempel = require('exempel');

function Position(source) {
  exempel.Model.call(this, source);

  // sets default GeoJSON structure
  // if not defined in source
  if (!this.has('type')) {
    this.set('type', 'Point');
  }
  if (!this.has('coordinates')) {
    this.set('coordinates', []);
  }
}

util.inherits(Position, exempel.Model);

Position.prototype.setFromNavigator = function(position) {
  // applies position of geolocation result to object
  this.set('coordinates[0]', position.coords.latitude);
  this.set('coordinates[1]', position.coords.longitude);

  return this;
};

Position.prototype.toGoogleLatLng = function() {
  var coords = this.get('coordinates');

  return new google.maps.LatLng(coords[0], coords[1]);
};

module.exports = Position;
