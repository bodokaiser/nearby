var fs               = require('fs');
var util             = require('util');
var componentbuilder = require('component-builder');

module.exports = function(app) {

    var builder = new componentbuilder('./');

    app.configure(function() {
        builder.addLookup('./app/boot');

        require('./templates')(app, builder);
        require('./environment')(app, builder);
    });

    app.configure('development', function() {
        builder.development();
    });

    builder.doBuild = function(callback) {
        builder.build(function(err, res) {
            if (err) return callback;
            
            writeStylesheetToFile(app.settings, res.css);
            writeJavascriptToFile(app.settings, res.require + res.js);

            if (callback) callback;
        });
    };

    return builder;

};

function writeStylesheetToFile(settings, stylesheet) {
    var options = settings.builder.stylesheet;

    fs.writeFileSync(generateBuildPath(options), stylesheet);
}

function writeJavascriptToFile(settings, javascript) {
    var options = settings.builder.javascript;

    fs.writeFileSync(generateBuildPath(options), javascript);
}

function generateBuildPath(options) {
    var format = __dirname + '/../..%s/%s';

    return util.format(format, options.path, options.name);
}
