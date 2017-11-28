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
      socket.emit('getId', socket.id);
    })

    socket.on('chat message', data => {
      const user = users[data.id]

      if (user.room) {
        io.to(user.room).emit('chat message', {
          sender: user.name,
          color: user.color,
          msg: data.msg
        })
        console.log(user.name + ' sent a message to room ' + user.room + ': ' + data.msg);
      } else {
        io.emit('chat message', {
          sender: user.name,
          color: user.color,
          msg: data.msg
        })
        console.log(user.name + ' sent a universal message: ' + data.msg);
      }
    })

    socket.on('make room', (data) => {
      rooms[data.room] = {
        room: data.room,
        pass: data.pass || null,
        population: 0 // num users in room
      }
      io.emit('new-room', {
        name: data.room
      })
      console.log('somebody created a new room')
    })

    socket.on('join', (data) => {
      if (!rooms[data.room] || rooms[data.room] === undefined) return

      let roome = rooms[data.room]
      if (roome.pass && roome.pass != pass) return

      users[data.id].room = data.room
      rooms[data.room].population++

      socket.join(users[data.id].room)
      console.log(users[data.id].room);
      console.log('somebody joined a room')
    })

    socket.on('disconnect', () => {
      delete users[socket.id]
      console.log('somebody disconnected')
    })

  })

  return io
}