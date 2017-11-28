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
      console.log(data.user + ' connected');
    })

    socket.on('chat message', msg => {
      const user = users[socket.id]

      if (user.room) {
        io.to(user.room).emit('chat message', {
          sender: user.name,
          color: user.color,
          msg
        })
        console.log(user.name + ' sent a message to ' + user.room + ': ' + msg);
      } else {
        io.emit('chat message', {
          sender: user.name,
          color: user.color,
          msg
        })
        console.log(user.name + ' sent a universal message: ' + msg);
      }
    })

    socket.on('make room', (data) => {
      rooms[data.room] = {
        room: data.room,
        pass: data.pass || null,
        population: 0 // num users in room
      }
      console.log('somebody created a new room')
    })

    socket.on('join', (data) => {
      if (!rooms[data.room]) return

      let roome = rooms[data.room]
      if (roome.pass && roome.pass != pass) return

      users[socket.id].room = data.room
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