var events = require('events');

var app = new events.EventEmitter();

require('./config')(app);

require('./element')(app);

require('./location')(app);

require('./overlay')(app);

require('./websocket')(app);
