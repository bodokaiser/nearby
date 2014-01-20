module.exports = function(app) {

    app('/', function(context, next) {
        context.events.on('connected', function() {
            navigator.geolocation.getCurrentPosition(updateSocket);
            navigator.geolocation.watchPosition(updateSocket);
        });

        function updateSocket(position) {
            context.events.emit('location', positionToGeometry(position));
        }
    });

};

function positionToGeometry(position) {
    var geometry = { type: 'Point', coordinates: [] };

    geometry.coordinates.push(position.coords.latitude);
    geometry.coordinates.push(position.coords.longitude);

    return geometry;
}
