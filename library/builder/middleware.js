var builder = require('./builder');

module.exports = function(app) {

    return function(req, res, next) {
        if (req.path.indexOf('build') == -1) return next();

        builder.doBuild(next);
    };

};
