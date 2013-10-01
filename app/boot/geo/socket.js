var emitter = require('emitter');

function GeoSocket() {
    emitter(this);

    this.id = null;

    this.ws = new WebSocket('ws://localhost:3000');
    
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
