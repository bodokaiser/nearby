var fs   = require('fs');
var util = require('util');

exports.writeStylesheet = function(settings, stylesheet, callback) {
    var options = settings.builder.stylesheet;

    fs.writeFile(generateBuildPath(options), stylesheet, callback);
}

exports.writeJavaScript = function(settings, javascript, callback) {
    var options = settings.builder.javascript;

    fs.writeFile(generateBuildPath(options), javascript, callback);
}

function generateBuildPath(options) {
    var format = __dirname + '/../..%s/%s';

    return util.format(format, options.path, options.name);
}
