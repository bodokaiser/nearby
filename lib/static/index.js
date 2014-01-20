var st = require('st');

module.exports = function(app) {

    var options = app.settings.static;

    app.use(st(options));

};
