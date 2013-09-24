var express = require('express');

var app = express();

require('./config')(app);

require('./static')(app);

require('./builder')(app);

module.exports = app;

app.listen(app.settings.port);
