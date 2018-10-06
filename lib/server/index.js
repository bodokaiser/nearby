const cluster = require('cluster')

module.exports = app => {

  if (app.get('env') == 'production') {
    if (cluster.isMaster) require('./master')(app)
    if (cluster.isWorker) require('./worker')(app)
  }

  if (app.get('env') == 'development') {
    require('./worker')(app)
  }

}
