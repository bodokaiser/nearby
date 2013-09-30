var util       = require('util');
var events     = require('events');
var websocketx = require('websocket-x');

function GeoServer() {
    this.wsserver = new websocketx.Server();

    bindToWebSocketServerOpenEvent(this.wsserver, this);
    bindToWebSocketServerCloseEvent(this.wsserver, this);
    bindToWebSocketServerMessageEvent(this.wsserver, this);
}

util.inherits(GeoServer, events.EventEmitter);

GeoServer.prototype.broadcast = function(location) {
    this.wsserver.broadcast(JSON.stringify(location));

    return this;
};

GeoServer.prototype.listen = function(server) {
    this.wsserver.listen(server);

    return this;
};

module.exports = GeoServer;

function bindToWebSocketServerOpenEvent(wsserver, geoserver) {
    wsserver.addListener('open', function(wssocket) {
    
    });
}

function bindToWebSocketServerCloseEvent(wsserver, geoserver) {
    wsserver.addListener('close', function(wssocket, incoming) {

    });
}

function bindToWebSocketServerMessageEvent(wsserver, geoserver) {
    wsserver.addListener('message', function(wssocket, incoming, outgoing) {

    });
}
