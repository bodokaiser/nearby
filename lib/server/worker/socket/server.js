const {
  Server,
  Outgoing
} = require('walve')


class WSServer extends Server {

  constructor(options) {
    super(options)

    // store connected sockets
    this.sockets = []

    // apply api sugar on connect
    listenToConnectEvent(this)
  }

  send(object, socket) {
    var message = JSON.stringify(object)

    let outgoing = new Outgoing({
      header: {
        length: message.length
      }
    })

    outgoing.pipe(socket, {
      end: false
    })
    outgoing.end(message)

    return this
  }

  broadcast(object) {
    var message = JSON.stringify(object)

    this.sockets.forEach(socket => {
      let outgoing = new Outgoing({
        header: {
          length: message.length
        }
      })

      outgoing.pipe(socket, {
        end: false
      })
      outgoing.end(message)
    })

    return this
  }
}

module.exports = WSServer

function listenToConnectEvent(server) {
  var sockets = server.sockets

  server.on('connect', socket => {
    socket.on('incoming', incoming => {
      // secures server from beeing flooded by too large frames
      // most messages will be below 0x7e in length
      if (incoming.header.length > 0xffff) {
        return socket.end()
      }

      // cache frame payload to be parsed as JSON
      var message = ''
      incoming.on('readable', () => {
        message += incoming.read().toString()
      })
      incoming.on('end', () => {
        socket.emit('message', JSON.parse(message))
      })
    })
    socket.on('close', () => {
      // remove sockets on disconnect so we do not waste
      // any resources when broadcasting
      sockets.splice(sockets.indexOf(socket), 1)
    })

    // add socket to our collection
    sockets.push(socket)
  })
}
