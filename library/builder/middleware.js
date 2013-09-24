var fs   = require('fs');
var util = require('util');

var builder = require('./builder');

module.exports = function(app) {

    return function(req, res, next) {
        if (app.settings.env == 'production') return next();

        builder(app).build(function(err, res) {
            if (err) return next(err);

            writeStylesheetToFile(app.settings, res.css);
            writeJavascriptToFile(app.settings, res.require + res.js);

            next();
        });
    };

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
