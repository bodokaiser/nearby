var express = require('express');

var app = express();

require('./config')(app);

require('./engine')(app);

require('./static')(app);

require('./models')(app);

require('./routes')(app);

require('./cluster')(app);

module.exports = app;
