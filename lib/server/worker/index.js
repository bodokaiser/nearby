const http = require('http')

module.exports = app => {

  let options = app.settings.server

  app.server = http.createServer(app)
  app.server.listen(options.port, () => {
    console.log(`listening on port ${options.port}`)
  })

  require('./socket')(app)

}
