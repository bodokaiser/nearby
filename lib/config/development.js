var lodash = require('lodash');

module.exports = function(app) {

	app.configure('development', function() {
		var settings = lodash.cloneDeep(require('../../etc/development'));

		lodash.merge(app.settings, settings);
	});

};
