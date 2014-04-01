var cluster = require('cluster');

module.exports = function(app) {

  app.configure('production', function() {
    if (cluster.isMaster) require('./master')(app);
    if (cluster.isWorker) require('./worker')(app);
  });

  app.configure('development', function() {
    require('./worker')(app);
  });

};
