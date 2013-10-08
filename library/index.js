var util    = require('util');
var https   = require('https');
var express = require('express');

var app = express();

require('./config')(app);

app.server = https.createServer(app.settings.cert, app);

require('./static')(app);

require('./models')(app);

require('./location')(app);

app.server.listen(app.settings.port, function() {
    console.log(util.format('listening on %d\n', app.settings.port));
});

module.exports = app;
