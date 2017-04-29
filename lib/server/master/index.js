var os      = require('os');
var util    = require('util');
var lodash  = require('lodash');
var cluster = require('cluster');

module.exports = app => {

  lodash.forEach(os.cpus(), app => {
    cluster.fork();
  });

  cluster.on('fork', worker => {
    console.log(util.format('forked worked %d', worker.id));
  });

  cluster.on('exit', worker => {
    console.log(util.format('exited worked %d', worker.id));
  });

};
