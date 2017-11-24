
module.exports = http => {
  const io = require('socket.io')(http)

  io.on('connection', socket => {
    socket.on('chat message', msg => {
      io.emit('chat message', msg)
    })
  })

  return io
}
