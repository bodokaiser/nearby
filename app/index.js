var events = require('events');

var app = createEmitter();

require('./models')(app);

require('./socket')(app);

require('./element')(app);

require('./location')(app);

function createEmitter() {
  return new events.EventEmitter();
}
