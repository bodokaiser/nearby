module.exports = function(app) {

    app.settings = {
        
        overlay: {
            zoom: 16
        },
        
        websocket: {
            url: generateWebSocketUrl()
        }

    };

};

function generateWebSocketUrl() {
    var url = 'wss://';

    url += location.hostname;
    url += ':';
    url += location.port;

    return url;
}
