const fs = require('fs')
const shortify = require('shortify')
const uglifyify = require('uglifyify')
const browserify = require('browserify')

module.exports = app => {
  let options = app.settings.engine.builder

  // will build app script on start - please wait some seconds before
  // doing first requests else the build file will get corrupted
  if (app.get('env') == 'production') {
    let writer = createWriter(app, options)
    let builder = createBuilder(app, options)

    builder.bundle().pipe(writer)
  }

  // will rebuild app script on each request so you can directly
  // change files under /app during development
  if (app.get('env') == 'development') {
    app.get('/javascripts/*.js', (req, res, next) => {
      let writer = createWriter(app, options)
      let builder = createBuilder(app, options)

      builder.bundle().on('error', next)
        .pipe(writer.on('finish', next))
    })
  }

}

function createWriter(app, options) {
  return fs.createWriteStream(options.output)
}

function createBuilder(app, options) {
  let builder = browserify(options)

  builder.add(options.entry)
  builder.transform(shortify(options.aliases))

  // this will remove all the full blown lodash stuff
  if (app.get('env') == 'production') {
    builder.transform({
      global: true
    }, uglifyify)
  }

  return builder
}
