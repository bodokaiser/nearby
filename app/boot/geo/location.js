var emitter = require('emitter');

function GeoLocation() {
    emitter(this);

    this.watcher = null;
}

GeoLocation.prototype.current = function(callback) {
    var self = this;
    
    navigator.geolocation.getCurrentPosition(function(position) {
        var geometry = positionToGeometry(position);

        callback(geometry);
    });

    return this;
};

GeoLocation.prototype.start = function() {
    var self = this;

    this.watcher = navigator.geolocation.watchPosition(function(position) {
        var geometry = positionToGeometry(position);

        self.emit('location', geometry);
    });

    return this;
};

GeoLocation.prototype.stop = function() {
    navigator.geolocation.clearWatch(this.watcher);

    return this;
};

module.exports = GeoLocation;

function positionToGeometry(position) {
    var geometry = { type: 'Point', coordinates: [] };
    
    geometry.coordinates.push(position.coords.latitude);
    geometry.coordinates.push(position.coords.longitude);

    return geometry;
}
