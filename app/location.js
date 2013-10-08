module.exports = function(app) {
 
    app.addListener('websocket:open', function() {   
        navigator.geolocation.getCurrentPosition(function(position) {
            var geometry = positionToGeometry(position);

            app.emit('location:current', geometry);
        }, function(error) {
            throw error;
        });

        navigator.geolocation.watchPosition(function(position) {
            var geometry = positionToGeometry(position);

            app.emit('location:update', geometry);
        });
    });

};

function positionToGeometry(position) {
    var geometry = { type: 'Point', coordinates: [] };
    
    geometry.coordinates.push(position.coords.latitude);
    geometry.coordinates.push(position.coords.longitude);

    return geometry;
}
