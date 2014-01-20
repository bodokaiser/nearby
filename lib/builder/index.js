var fs         = require('fs');
var browserify = require('browserify');

module.exports = function(app) {

    var options = app.settings.builder;

    app.configure('production', function() {
        var writer = createWriter(app, options);
        var builder = createBuilder(app, options);

        builder.bundle(options).pipe(writer);
    });

    app.configure('development', function() {
        app.get('/javascripts/*.js', function(req, res, next) {
            var writer = createWriter(app, options);
            var builder = createBuilder(app, options);

            builder.bundle(options).on('error', next)
                .pipe(writer.on('finish', next));
        });
    });

};

function createWriter(app, options) {
    return fs.createWriteStream(options.output);
}

function createBuilder(app, options) {
    return browserify(options);
}
