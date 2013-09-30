module.exports = function(wsserver) {

    wsserver.on('message', function(wssocket, incoming) {
        var message, buffer = [];

        incoming.on('readable', function() {
            buffer.push(incoming.read());
        });

        incoming.on('end', function() {
            message = Buffer.concat(buffer).toString();

            wsserver.broadcast(message);
        });
    });

};
