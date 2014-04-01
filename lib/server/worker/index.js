var http = require('http');
var util = require('util');

module.exports = function(app) {

  var options = app.settings.server;

  app.server = http.createServer(app);
  app.server.listen(options.port, function() {
    console.log(util.format('listening on port %d', options.port));
  });

  require('./socket')(app);

};
