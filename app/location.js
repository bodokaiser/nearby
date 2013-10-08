module.exports = function(app) {
 
    navigator.geolocation.getCurrentPosition(function(position) {
        var geometry = positionToGeometry(position);

        app.emit('location:current', geometry);
    });

    navigator.geolocation.watchPosition(function(position) {
        var geometry = positionToGeometry(position);

        app.emit('location:update', geometry);
    });

};

function positionToGeometry(position) {
    var geometry = { type: 'Point', coordinates: [] };
    
    geometry.coordinates.push(position.coords.latitude);
    geometry.coordinates.push(position.coords.longitude);

    return geometry;
}
