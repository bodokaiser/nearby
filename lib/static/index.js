const st = require('st')

module.exports = app => {

  let options = app.settings.static

  app.use(st(options))

}
