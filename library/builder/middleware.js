var write = require('./writer');

module.exports = function(app, builder) {

    return function(req, res, next) {
        if (req.path.indexOf('build') == -1) return next();

        builder.build(function(err, res) {
            if (err) throw err;

            writer.write(app.settings, res);
        });
    };

};
