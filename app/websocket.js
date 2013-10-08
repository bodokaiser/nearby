module.exports = function(app) {

    var wsocket = new WebSocket(app.settings.websocket.url);

    wsocket.addEventListener('open', function() {
        app.emit('websocket:open');
    });

    wsocket.addEventListener('message', function(e) {
        var message = JSON.parse(e.data);

        app.emit('websocket:update', message);
    });

    app.addListener('location:update', function(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    });

    app.addListener('location:current', function(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    });

};
