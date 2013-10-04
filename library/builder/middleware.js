var writer = require('./writer');

module.exports = function(app) {

    return function(req, res, next) {
        if (req.path.indexOf('build') == -1) return next();

        // NOTE: builder MUST be reconstructed
        var builder = require('./builder')(app);

        builder.build(function(err, res) {
            if (err) throw err;

            var styles = res.css;

            var script = 'window.config = ';
            script += JSON.stringify(app.settings.application);
            script += res.require;
            script += res.js;

            writer.writeStylesheet(app.settings, styles, function(err) {
                if (err) return next(err);

                writer.writeJavaScript(app.settings, script, function(err) {
                    if (err) return next(err);

                    next();
                });
            });
        });
    };

};
