module.exports = function(app) {

    var map = new google.maps.Map(app.$element, app.settings.overlay);

    app.on('location:current', function(geometry) {
        var latLng = geometryToLatLng(geometry);

        map.setCenter(latLng);
    });

    var markers = [];

    app.on('websocket:update', function(geometries) {
        markers.forEach(function(marker) {
            marker.setMap(null);

            markers.splice(0, 1);
        });

        geometries.forEach(function(geometry) {
            var latLng = geometryToLatLng(geometry);

            var marker = new google.maps.Marker({
                position: latLng, map: map
            });

            markers.push(marker);
        });
    });

};

function geometryToLatLng(geometry) {
    var latitude = geometry.coordinates[0];
    var longitude = geometry.coordinates[1];

    return new google.maps.LatLng(latitude, longitude);
}
