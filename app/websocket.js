module.exports = function(app) {

    var wsocket = new WebSocket(app.settings.websocket.url);

    wsocket.addEventListener('open', function() {
        app.emit('websocket:open');
    });

    wsocket.addEventListener('message', function(e) {
        var message = JSON.parse(e.data);

        app.emit('websocket:update', message);
    });

    app.addListener('location:current', pushGeometryToSocket);
    app.addListener('location:update', pushGeometryToSocket);

    function pushGeometryToSocket(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    }

};
