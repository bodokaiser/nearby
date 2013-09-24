var fs         = require('fs');
var path       = require('path');
var stringtojs = require('string-to-js');

module.exports = function(builder) {

    builder.hook('before scripts', function(package) {
        var templates = package.config.templates;

        if (!templates) return;

        templates.forEach(function(template) {
            var path = package.path(template);

            package.addFile('scripts', 
                pathToJsType(path), pathToScript(path));
        });
    });

};

function pathToScript(path) {
    var file = fs.readFileSync(path);

    return stringtojs(file);
}

function pathToJsType(path) {
    return path.basename(path, '.html') + '.js';
}
