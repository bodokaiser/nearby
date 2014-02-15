var lodash = require('lodash');

module.exports = function(app) {

	app.configure(function() {
		var settings = lodash.cloneDeep(require('../../etc/general'));

		lodash.merge(app.settings, settings);
	});

};
