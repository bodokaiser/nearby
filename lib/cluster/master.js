var os      = require('os');
var util    = require('util');
var lodash  = require('lodash');
var cluster = require('cluster');

module.exports = function(app) {

  lodash.forEach(os.cpus(), function(cpu) {
    cluster.fork();
  });

  cluster.on('fork', function(worker) {
    console.log(util.format('Application forked worker %d.', worker.id));
  });

  cluster.on('exit', function(worker) {
    console.log(util.format('Application closed worker %d.', worker.id));
  });

};
