var fs         = require('fs');
var shortify   = require('shortify');
var uglifyify  = require('uglifyify');
var browserify = require('browserify');

module.exports = function(app) {

	var options = app.settings.engine.builder;

	app.configure('production', function() {
		var writer = createWriter(app, options);
		var builder = createBuilder(app, options);

		builder.bundle(options).pipe(writer);
	});

	app.configure('development', function() {
		app.get('/javascripts/*.js', function(req, res, next) {
			var writer = createWriter(app, options);
			var builder = createBuilder(app, options);

			builder.bundle(options).on('error', next)
				.pipe(writer.on('finish', next));
		});
	});

};

function createWriter(app, options) {
	return fs.createWriteStream(options.output);
}

function createBuilder(app, options) {
	var builder = browserify(options);

  app.configure(function() {
    builder.add(options.entry);
    builder.transform(shortify(options.aliases));
  });
  app.configure('production', function() {
    builder.transform({ global: true }, uglifyify);
  });

  return builder;
}
