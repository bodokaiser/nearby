var websocketx = require('websocket-x');

module.exports = function(app) {

    var wsserver = new websocketx.Server();

    wsserver.on('message', function(wssocket, incoming, outgoing) {
        var message, buffer = [];

        incoming.on('readable', function() {
            buffer.push(incoming.read());
        });

        incoming.on('end', function() {
            var message = Buffer.concat(buffer);

            wsserver.broadcast(JSON.stringify([message]));
        });
    });

    wsserver.listen(app.server);

};
