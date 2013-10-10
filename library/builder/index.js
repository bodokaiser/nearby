var fs         = require('fs');
var watchify   = require('watchify');
var browserify = require('browserify');
    
var PATH_PREFIX = __dirname + '/../../';

module.exports = function(app) {

    app.configure('production', function() {
        var builder = createBuilder(app, browserify);

        builder.bundle().pipe(createWriter(app));
    });

    app.configure('development', function() {
        var builder = createBuilder(app, watchify);

        builder.addListener('update', function() {
            builder.bundle().pipe(createWriter(app));
        });
        
        builder.bundle().pipe(createWriter(app));
    });

};

function createBuilder(app, constructor) {
    var options = app.settings.browserify;

    options.entries.forEach(function(entry, index) {
        options.entries[index] = PATH_PREFIX + entry;
    });

    return constructor(options);
}

function createWriter(app) {
    var options = app.settings.browserify;

    return fs.createWriteStream(PATH_PREFIX + options.output);
}
