var path     = require('path');
var lodash   = require('lodash');
var packpath = require('packpath');

module.exports = function(app) {

    app.configure(function() {
        lodash.forIn(app.settings, resolve);
    });

};

function resolve(value, index, source) {
    if (lodash.isArray(value)) {
        return lodash.forEach(value, resolve);
    }
    if (lodash.isPlainObject(value)) {
        return lodash.forIn(value, resolve);
    }
    if (lodash.isString(value) && !value.indexOf('/')) {
        source[index] = path.join(packpath.self(), value);
    }
}
