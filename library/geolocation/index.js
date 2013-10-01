var mongoose  = require('mongoose');
var websocket = require('websocket-x');

module.exports = function(app) {

    var Location = mongoose.model('Location');

    websocket.createServer(function(wssocket) {
        
        Location.create(function(err, location) {
            if (err) throw err;

            Location.find(function(err, locations) {
                if (err) throw err;
                
                var message = {};
                
                message._id = location._id;
                message.body = locations.map(function(location) {
                    return location.geometry;
                });

                wssocket.send(JSON.stringify(message));
            });

            wssocket.location = location;
        });

        wssocket.addListener('message', function() {

        });

        wssocket.addListener('close', function() {
            wssocket.location.remove();
        });

    }).listen(app.server);

};
