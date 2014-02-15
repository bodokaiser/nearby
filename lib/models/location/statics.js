module.exports = function(app, schema) {

	schema.static('create', function(callback) {
		return new this().save(callback);
	});

};
