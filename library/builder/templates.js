var fs         = require('fs');
var path       = require('path');
var stringtojs = require('string-to-js');

module.exports = function(app, builder) {

    builder.hook('before scripts', function(package) {
        var templates = package.config.templates;

        (templates || []).forEach(function(template) {
            var path = package.path(template);

            package.addFile('scripts', 
                pathToJsType(path), pathToScript(path));
        });
    });

};

function pathToScript(name) {
    var file = fs.readFileSync(name);

    return stringtojs(file.toString());
}

function pathToJsType(name) {
    return path.basename(name, '.html') + '.js';
}
