var emitter = require('emitter');

var app = new emitter();

require('./config')(app);

require('./element')(app);

require('./location')(app);

require('./overlay')(app);

require('./websocket')(app);

console.log('application booted');
