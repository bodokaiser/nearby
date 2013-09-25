var express = require('express');

var app = express();

require('./config')(app);

require('./builder')(app);

require('./static')(app);

require('./websocket')(app);

module.exports = app;

app.listen(app.settings.port);
