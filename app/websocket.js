var url = require('url');

module.exports = function(app) {

    var wsocket = createWebSocket(app);

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

function createWebSocket(app) {
    var url = formatWebSocketUrl(app);

    return new WebSocket(url);
}

function formatWebSocketUrl(app) {
    return url.format({
        protocol: 'ws',
        hostname: location.hostname,
        port: app.settings.websocket.port || location.port
    });
}
