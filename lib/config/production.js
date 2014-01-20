var lodash = require('lodash');

module.exports = function(app) {

    app.configure('production', function() {
        var settings = lodash.cloneDeep(require('../../etc/production'));

        lodash.merge(app.settings, settings);
    });

};
