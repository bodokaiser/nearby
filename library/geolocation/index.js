var mongoose  = require('mongoose');
var websocket = require('websocket-x');

module.exports = function(app) {

    var Location = mongoose.model('Location');

    websocket.createServer(function(wssocket) {
        
        new Location().save(function(err, location) {
            if (err) throw err;

            console.log(location);

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

    }).listen(app.server);

};
