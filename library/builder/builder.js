var componentbuilder = require('component-builder');

module.exports = function(app) {

    var builder = new componentbuilder('./');

    app.configure(function() {
        builder.addLookup('./app/boot');

        builder.use(require('./templates'));
    });

    app.configure('development', function() {
        builder.development();
    });

    return builder;

};
