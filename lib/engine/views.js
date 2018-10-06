const pug = require('pug')

module.exports = app => {
  let options = app.settings.engine.views

  app.set('views', options.path)
  app.set('view engine', options.engine)
  app.set('view options', options.locals)

  app.engine('pug', pug.renderFile)
}
