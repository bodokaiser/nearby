var GeoMap      = require('./geo/map');
var GeoPoint    = require('./geo/point');
var GeoSocket   = require('./geo/socket');
var GeoLocation = require('./geo/location');
    
var element = document.querySelector('#map');

var geomap = new GeoMap();

var geopoint = new GeoPoint();

var geosocket = new GeoSocket();

var geolocation = new GeoLocation();

geolocation.current(function(geometry) {
    geopoint.coordinates = geometry.coordinates;

    geomap.element = element;
    geomap.center = geopoint;

    geomap.toGoogleMaps();
});
