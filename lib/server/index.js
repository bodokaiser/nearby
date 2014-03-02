var http = require('http');

module.exports = function(app) {

  app.server = new http.Server(app);

  app.server.listen(app.settings.server.port);

};
