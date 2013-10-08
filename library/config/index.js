var fs = require('fs');

var ENVIRONMENT = '../../config/environment';
var DEVELOPMENT = '../../config/development';
var PRODUCTION  = '../../config/production';

var KEY  = '/../../config/cert/key.pem';
var CERT = '/../../config/cert/cert.pem';

module.exports = function(app) {

    app.configure(function() {
        mergeConfig(app.settings, require(ENVIRONMENT));
    });

    app.configure('development', function() {
        mergeConfig(app.settings, require(DEVELOPMENT));
    });

    app.configure('production', function() {
        mergeConfig(app.settings, require(PRODUCTION));
    });

    app.configure(function() {
        app.settings.cert = {
            key: fs.readFileSync(__dirname + KEY),
            cert: fs.readFileSync(__dirname + CERT)
        };
    });

};

function mergeConfig(source, object) {
    for (var key in object)
        source[key] = object[key];
}
