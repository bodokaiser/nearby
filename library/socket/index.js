var http     = require('http');
var socketio = require('socket.io');

module.exports = function(app) {

    var server = http.createServer(app);

    var sockets = socketio.listen(server, app.settings.socket);

    require('./connect')(sockets);

};
