var http    = require('http');
var express = require('express');

var app = express();

app.server = http.createServer(app);

require('./library/config')(app);

require('./library/builder')(app);

require('./library/static')(app);

require('./library/models')(app);

require('./library/location')(app);

app.server.listen(app.settings.port);

module.exports = app;
