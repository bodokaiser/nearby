var st = require('st');

module.exports = app => {

  var options = app.settings.static;

  app.use(st(options));

};
