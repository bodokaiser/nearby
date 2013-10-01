var GeoSocket   = require('./geo/socket');
var GeoLocation = require('./geo/location');

var $element = document.querySelector('#map');

new GeoLocation()
    .current(function(geometry) {
        var coords = geometry.coordinates;

        var map = new google.maps.Map($element, {
            center: new google.maps.LatLng(coords[0], coords[1]), zoom: 16
        });
        
        var geosocket = new GeoSocket();
     
        geosocket.on('open', function() {
            geosocket.send(geometry);    
        });

        geosocket.on('message', function(geometries) {
            geometries.forEach(function(geometry) {
                var coords = geometry.coordinates;

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(coords[0], coords[1]),
                    map: map
                });
            });
        });

    });
