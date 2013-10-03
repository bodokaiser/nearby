var fs   = require('fs');
var util = require('util');

exports.write = function(settings, result) {
    writeStylesheetToFile(settings, result.css);
    writeJavascriptToFile(settings, result.require + result.js);
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
