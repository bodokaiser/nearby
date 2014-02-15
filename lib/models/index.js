var mongoose = require('mongoose');

module.exports = function(app) {

	var options = app.settings.storage;

	mongoose.connect(options.url);

	require('./location')(app);

	mongoose.model('Location').remove(function() {
		// clears location memory
	});

};
