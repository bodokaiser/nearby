var websocketx = require('websocket-x');

module.exports = function(app) {

    var wsserver = new websocketx.Server();

    require('./open')(wsserver);
    require('./close')(wsserver);
    require('./message')(wsserver);

    wsserver.listen(app.server);

};
