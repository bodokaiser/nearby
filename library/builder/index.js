var browserify = require('browserify');

module.exports = function(app) {

    app.configure('production', function() {
        var builder = createBuilder(app);
    });

    app.configure('development', function() {

    });

};

function createBuilder(app) {
    var options = app.settings.browserify;

    var prefix = __dirname + '/../../';
    options.entries.forEach(function(entry, index) {
        options.entries[index] = prefix + entry;
    });
}
