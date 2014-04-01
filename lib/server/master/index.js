var os      = require('os');
var util    = require('util');
var lodash  = require('lodash');
var cluster = require('cluster');

module.exports = function(app) {

  lodash.forEach(os.cpus(), function(app) {
    cluster.fork();
  });

  cluster.on('fork', function(worker) {
    console.log(util.format('forked worked %d', worker.id));
  });

  cluster.on('exit', function(worker) {
    console.log(util.format('exited worked %d', worker.id));
  });

};
