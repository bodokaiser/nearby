var page = require('page');

var app = page;

require('./query')(app);

require('./events')(app);

require('./world')(app);

require('./socket')(app);

require('./routes')(app);

app.start();
