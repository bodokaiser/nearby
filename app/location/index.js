module.exports = function(app) {
 
    app.addListener('connected', function() {
        navigator.geolocation.getCurrentPosition(handlePosition);
        navigator.geolocation.watchPosition(handlePosition);
    });

    function handlePosition(position) {
        var geometry = positionToGeometry(position);

        app.emit('location', geometry);
    }

};

function positionToGeometry(position) {
    var geometry = { type: 'Point', coordinates: [] };
    
    geometry.coordinates.push(position.coords.latitude);
    geometry.coordinates.push(position.coords.longitude);

    return geometry;
}
