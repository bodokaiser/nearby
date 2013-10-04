var writer = require('./writer');

module.exports = function(app) {


    app.configure('production', function() {
        var builder = require('./builder')(app);

        builder.build(function(err, res) {
            if (err) throw err;

            var styles = res.css;

            var script = 'window.config = ';
            script += JSON.stringify(app.settings.application);
            script += res.require;
            script += res.js;

            writer.writeStylesheet(app.settings, styles, function(err) {
                if (err) throw err;
            });
            writer.writeJavaScript(app.settings, script, function(err) {
                if (err) throw err;
            });
        });
    });

    app.configure('development', function() {
        app.use(require('./middleware')(app));
    });

};
