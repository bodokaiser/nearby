var GeoSocket   = require('./geo/socket');
var GeoLocation = require('./geo/location');

var $element = document.querySelector('#map');

var markers = window.markers = [];

var geolocation = new GeoLocation();

geolocation.current(function(geometry) {
    var coords = geometry.coordinates;

    var map = new google.maps.Map($element, {
        center: new google.maps.LatLng(coords[0], coords[1]), zoom: 16
    });
    
    var geosocket = new GeoSocket();
 
    geosocket.on('open', function() {
        geosocket.send(geometry);    

        geolocation.on('location', function(geometry) {
            geosocket.send(geometry);
        }).start();
    });

    geosocket.on('message', function(geometries) {
        markers.forEach(function(marker, index) {
            marker.setMap(null);
            markers.splice(0, 1);
        });

        geometries.forEach(function(geometry) {
            var coords = geometry.coordinates;

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(coords[0], coords[1]),
                map: map
            });
            
            markers.push(marker);
        });
    });

});
