var writer = require('./writer');

module.exports = function(app) {

    var builder = require('./builder')(app);

    app.configure('production', function() {
        builder.build(function(err, res) {
            if (err) throw err;

            writer.write(app.settings, res);
        });
    });

    app.configure('development', function() {
        app.use(require('./middleware')(builder));
    });

};
