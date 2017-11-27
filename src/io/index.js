
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
        console.log(user.name+' sent a message to '+user.room);
      } else {
        io.emit('chat message', {
          sender: user.name,
          color: user.color,
          msg
        })
        console.log(user.name+' sent a universal message');
      }
    })

    socket.on('make room', ({ room, pass }) => {
      rooms[room] = {
        pass: pass || null,
        population: 0 // num users in room
      }
      console.log('somebody created a new room')
    })

    socket.on('join', ({ room, pass }) => {
      if (!rooms[room]) return

      let roome = rooms[room]
      if (roome.pass && roome.pass != pass) return

      users[socket.id].room = room
      rooms[roome].population++

      io.join(roome)
      console.log('somebody joined a room')
    })

    socket.on('disconnect', () => {
      delete users[socket.id]
      console.log('somebody disconnected')
    })

  })

  return io
}
