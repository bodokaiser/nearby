var emitter = require('emitter');

function GeoSocket(url) {
    emitter(this);

    this.ws = new WebSocket(url);
    
    bindToWebSocketOpenEvent(this.ws, this);
    bindToWebSocketMessageEvent(this.ws, this);
}

GeoSocket.prototype.send = function(geometry) {
    this.ws.send(JSON.stringify(geometry));

    return this;
};

module.exports = GeoSocket;

function bindToWebSocketOpenEvent(websocket, geosocket) {
    websocket.addEventListener('open', function(e) {
        geosocket.emit('open');
    });
}

function bindToWebSocketMessageEvent(websocket, geosocket) {
    websocket.addEventListener('message', function(e) {
        geosocket.emit('message', JSON.parse(e.data));
    });
}
