var url = require('url');

module.exports = function(app) {

    var wsocket = createWebSocket(app);

    wsocket.addEventListener('open', function() {
        app.emit('connected');
    });

    wsocket.addEventListener('close', function() {
        app.emit('disconnected');
    });

    wsocket.addEventListener('message', function(e) {
        var message = JSON.parse(e.data);

        app.emit('message', message);
    });

    app.addListener('location', function(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    });

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
