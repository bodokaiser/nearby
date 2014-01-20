var lodash = require('lodash');

module.exports = function(app) {

    var markers = [];

    app('*', function(context, next) {
        context.world = createWorld(context);

        context.events.on('location', function(geometry) {
            context.world.setCenter(geometryToLatLng(geometry));
        });
        context.events.on('message', function(geometries) {
            lodash.forEach(markers, function(marker) {
                marker.setMap(null);
            });
            lodash.forEach(geometries, function(geometry) {
                markers.push(createMarker(context, geometry));
            });
        });

        next();
    });

};

function createWorld(context) {
    var element = context.element;

    return new google.maps.Map(element, { zoom: 16 });
}

function createMarker(context, geometry) {
    return new google.maps.Marker({
        position: geometryToLatLng(geometry),
        map: context.world,
        draggable: true
    });
}

function geometryToLatLng(geometry) {
    var latitude = geometry.coordinates[0];
    var longitude = geometry.coordinates[1];

    return new google.maps.LatLng(latitude, longitude);
}
