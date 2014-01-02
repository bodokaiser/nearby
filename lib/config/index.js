var ENVIRONMENT = '../../etc/environment';
var DEVELOPMENT = '../../etc/development';
var PRODUCTION  = '../../etc/production';

module.exports = function(app) {

    app.configure(function() {
        merge(app.settings, require(ENVIRONMENT));
    });

    app.configure('development', function() {
        merge(app.settings, require(DEVELOPMENT));
    });

    app.configure('production', function() {
        merge(app.settings, require(PRODUCTION));
    });

};

function merge(source, object) {
    for (var key in object) {
        var value = object[key];

        if (!source.hasOwnProperty(key)) {
            source[key] = value;
        } else {
            merge(source[key], value);
        }
    }
}
