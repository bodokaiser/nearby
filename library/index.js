var http    = require('http');
var express = require('express');

var app = express();

app.server = http.createServer(app);

require('./config')(app);

require('./builder')(app);

require('./static')(app);

require('./tracker')(app);

app.server.listen(app.settings.port);

module.exports = app;
