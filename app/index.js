var page = require('page');

var app = page;

require('./events')(app);

require('./layout')(app);

require('./socket')(app);

require('./routes')(app);

app.start();
