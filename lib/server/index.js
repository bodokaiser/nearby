var cluster = require('cluster');

module.exports = app => {

  app.configure('production', () => {
    if (cluster.isMaster) require('./master')(app);
    if (cluster.isWorker) require('./worker')(app);
  });

  app.configure('development', () => {
    require('./worker')(app);
  });

};
