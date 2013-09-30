var emitter = require('emitter');

function GeoPoint(geometry) {
    emitter(this);

    this.type = 'Point';
    this.coordinates = [];
    this.coordinates.concat(geometry && geometry.coordinates);
}

GeoPoint.prototype.toGoogleMaps = function() {
    var lat = this.coordinates[0];
    var lng = this.coordinates[1];

    return new google.maps.LatLng(lat, lng);
};

module.exports = GeoPoint;
