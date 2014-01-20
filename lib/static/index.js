var st = require('st');

module.exports = function(app) {

    var options = app.settings.static;

    options.path = __dirname + '/../../' + options.path + '/';
    options.passthrough = true;
    options.index = 'index.html';

    app.use(st(options));

};
