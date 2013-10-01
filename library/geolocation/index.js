var mongoose  = require('mongoose');
var websocket = require('websocket-x');

module.exports = function(app) {

    var Location = mongoose.model('Location');

    websocket.createServer(function(wssocket) {
        
        var location = new Location();

        wssocket.addListener('message', function(incoming, outgoing) {
            var buffer = [];

            incoming.on('readable', function() {
                buffer.push(incoming.read());
            });

            incoming.on('end', function() {
                var message = Buffer.concat(buffer).toString();

                location.geometry = JSON.parse(message);

                location.save(function(err, location) {
                    if (err) return;

                    Location.find(function(err, locations) {
                        if (err) return;

                        var message = locations.map(function(location) {
                            return location.geometry;
                        });

                        wssocket.send(JSON.stringify(message));
                    });
                });
            });
        });

        wssocket.addListener('close', function() {
            location.remove();
        });

    }).listen(app.server);

};
