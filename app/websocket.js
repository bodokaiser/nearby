module.exports = function(app) {

    var wsocket = new WebSocket(app.settings.websocket.url);

    /**
     * NOTE:
     * The seems to be a bug on iPhone which causes the WebSocket connection
     * to break up. To overcome this a solution is to decouple WebSocket events
     * from GeoLocation events. However this makes stuff complicated so do not
     * wonder...
     */
    var position;

    wsocket.addEventListener('open', function() {
        if (!position) return;

        var message = JSON.stringify(position);
 
        wssocket.send(message);
    });

    wsocket.addEventListener('message', function(e) {
        var message = JSON.parse(e.data);

        app.emit('websocket:update', message);
    });

    app.addListener('location:current', function(geometry) {
        var message = JSON.stringify(geometry);
        
        if (wssocket.readyState === wssocket.OPEN) {
            wsocket.send(message);
        } else {
            position = geometry;
        }
    });

    app.addListener('location:update', function(geometry) {
        var message = JSON.stringify(geometry);

        wsocket.send(message);
    });

};
