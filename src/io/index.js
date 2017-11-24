
module.exports = http => {
  const io = require('socket.io')(http)
  const users = {}

  io.on('connection', socket => {

    socket.on('user', data => {
      users[socket.id] = {
        name: data.user,
        color: data.color
      }
    })

    socket.on('chat message', msg => {
      const user = users[socket.id]

      io.emit('chat message', {
        sender: user.name,
        color: user.color,
        msg
      })
    })

    socket.on('disconnect', () => {
      delete users[socket.id]
    })

  })

  return io
}
