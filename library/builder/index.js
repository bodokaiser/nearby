var fs         = require('fs');
var browserify = require('browserify');
    
var PATH_PREFIX = __dirname + '/../../';

module.exports = function(app) {

    app.configure('production', function() {
        var builder = createBuilder(app);

        builder.bundle().pipe(createWriter(app));
    });

    app.configure('development', function() {
        var builder = createBuilder(app);

        builder.bundle().pipe(createWriter(app));
    });

};

function createBuilder(app) {
    var options = app.settings.browserify;

    options.entries.forEach(function(entry, index) {
        options.entries[index] = PATH_PREFIX + entry;
    });

    return browserify(options);
}

function createWriter(app) {
    var options = app.settings.browserify;

    return fs.createWriteStream(PATH_PREFIX + options.output);
}
