var browserify = require('browserify');

module.exports = function(app) {

    var builder = browserify();

    app.configure(function() {
        builder.add(entryFile(app));
    });

    app.configure('production', function() {

    });

    app.configure('development', function() {

    });

};

function entryFile(app) {
    var options = app.settings.browserify;

    return __dirname + '/../../' + options.entry;
}
