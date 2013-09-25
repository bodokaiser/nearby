var express = require('express');

var app = express();

require('./config')(app);

require('./socket')(app);

require('./builder')(app);

require('./static')(app);

module.exports = app;

app.listen(app.settings.port);
