
module.exports = http => {
  const io = require('socket.io')(http)
  const users = {}
  const rooms = {}

  io.on('connection', socket => {

    socket.on('user', data => {
      users[socket.id] = {
        name: data.user,
        color: data.color
      }
    })

    socket.on('chat message', msg => {
      const user = users[socket.id]

      if (user.room) {
        io.to(user.room).emit('chat message', {
          sender: user.name,
          color: user.color,
          msg
        })
      } else {
        io.emit('chat message', {
          sender: user.name,
          color: user.color,
          msg
        })
      }
    })

    socket.on('make room', ({ room, pass }) => {
      rooms[room] = {
        pass: pass || null,
        population: 0 // num users in room
      }
    })

    socket.on('join', ({ room, pass }) => {
      if (!rooms[room]) return

      let room = rooms[room]
      if (room.pass && room.pass != pass) return

      users[socket.id].room = room
      rooms[room].population++

      io.join(room)
    })

    socket.on('disconnect', () => {
      delete users[socket.id]

    })

  })

  return io
}
