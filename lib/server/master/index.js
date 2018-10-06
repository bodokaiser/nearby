const os = require('os')
const lodash = require('lodash')
const cluster = require('cluster')

module.exports = app => {

  lodash.forEach(os.cpus(), () => cluster.fork())

  cluster.on('fork', worker => console.log(`forked worked ${worker.id}`))
  cluster.on('exit', worker => console.log(`exited worked ${worker.id}`))

};
