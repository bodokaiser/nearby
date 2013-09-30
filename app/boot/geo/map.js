var emitter = require('emitter');

function GeoMap(element, point) {
    emitter(this);

    this.center = point;
    this.element = element;
}

GeoMap.prototype.toGoogleMaps = function() {
    var options = {};

    options.zoom = 16;
    options.center = this.center.toGoogleMaps();

    return new google.maps.Map(this.element, options);
};

module.exports = GeoMap;
