module.exports = function(app) {

    var wsocket = new WebSocket(app.settings.websocket.url);

    app.on('location:update', function(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    });

    app.on('location:current', function(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    });

    wsocket.addEventListener('message', function(e) {
        var message = JSON.parse(e.data);

        app.emit('websocket:update', message);
    });

};
