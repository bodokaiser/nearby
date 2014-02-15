var http    = require('http');
var express = require('express');

var app = express();

app.server = http.createServer(app);

require('./config')(app);

require('./engine')(app);

require('./static')(app);

require('./models')(app);

require('./routes')(app);

require('./location')(app);

app.server.listen(app.settings.server.port);

module.exports = app;
