const express = require('express')

let app = express()

require('./config')(app)

require('./engine')(app)

require('./routes')(app)

require('./static')(app)

require('./server')(app)

module.exports = app
