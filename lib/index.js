var express = require('express');

var app = express();

require('./config')(app);

require('./engine')(app);

require('./static')(app);

require('./routes')(app);

require('./server')(app);

require('./socket')(app);

module.exports = app;
