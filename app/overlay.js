module.exports = function(app) {

    var map = new google.maps.Map(app.$element, app.settings.overlay.map);

    app.addListener('location:current', function(geometry) {
        var latLng = geometryToLatLng(geometry);

        map.setCenter(latLng);
    });

    var markers = [];

    app.addListener('websocket:update', function(geometries) {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        markers = [];

        geometries.forEach(function(geometry) {
            var latLng = geometryToLatLng(geometry);

            var marker = new google.maps.Marker({
                position: latLng, map: map, draggable: true
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
