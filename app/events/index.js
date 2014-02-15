var events = require('events');

module.exports = function(app) {

	app('*', function(context, next) {
		context.events = createEmitter();

		next();
	});

};

function createEmitter() {
	return new events.EventEmitter();
}
