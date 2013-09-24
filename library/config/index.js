var ENVIRONMENT = '../../config/environment';
var DEVELOPMENT = '../../config/development';
var PRODUCTION  = '../../config/production';

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

};

function mergeConfig(source, object) {
    for (var key in object)
        source[key] = object[key];
}
