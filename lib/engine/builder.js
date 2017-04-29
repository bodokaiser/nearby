var fs         = require('fs');
var shortify   = require('shortify');
var uglifyify  = require('uglifyify');
var browserify = require('browserify');

module.exports = app => {

  var options = app.settings.engine.builder;

  // will build app script on start - please wait some seconds
  // before doingfirst requests else the build file will get corrupted
  app.configure('production', () => {
    var writer = createWriter(app, options);
    var builder = createBuilder(app, options);

    builder.bundle(options).pipe(writer);
  });

  // will rebuild app script on each request so you can directly
  // change files under /app during development
  app.configure('development', () => {
    app.get('/javascripts/*.js', (req, res, next) => {
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

  app.configure(() => {
    builder.add(options.entry);
    builder.transform(shortify(options.aliases));
  });

  // this will remove all the full blown lodash stuff
  app.configure('production', () => {
    builder.transform({ global: true }, uglifyify);
  });

  return builder;
}
