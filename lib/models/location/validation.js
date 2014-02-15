module.exports = function(app, schema) {

	schema.path('geometry.coordinates').validate(function(value, next) {
		next(value && value.length == 2);
	});

};
