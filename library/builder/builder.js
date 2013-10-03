var componentbuilder = require('component-builder');

module.exports = function(app) {

    var builder = new componentbuilder('./');

    app.configure(function() {
        builder.addLookup('./app/boot');

        require('./templates')(app, builder);
        require('./environment')(app, builder);
    });

    app.configure('development', function() {
        builder.development();
    });

    return builder;

};
