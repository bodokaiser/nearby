var http     = require('http');
var socketio = require('socket.io');

module.exports = function(app) {

    var server = http.createServer(app);

    var sockets = socketio.listen(server, app.settings.socket);

    sockets.on('connect', function(socket) {

        require('./connect')(socket, sockets);
        require('./message')(socket, sockets);
        require('./disconnect')(socket, sockets);

    });

};
