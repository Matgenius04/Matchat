const messageHTML = ({ sender, msg, color }) => {

  console.log(`${sender}: ${msg}`)

  return $('<li>')
    .append($(
      `<div class="message">
        <span class="user" style="color: ${color}">${sender}</span>&nbsp;-&nbsp;<span>${msg}</span>
      </div>
    `))
}

const getRandomColor = () => {
  const rand = (min, max) => min + Math.random() * (max - min)

  let h = rand(1, 360)
  let s = 100
  let l = rand(3, 6) * 10

  return `hsl(${h},${s}%,${l}%)`
}

const makeRoom = (roomname, callback) => {

  console.log("added room"+`${roomname}`)

  $('#rooms').append($(`
      <li class="room">
        <span class="roomname">${roomname}</span>
      </li>
    `))

  callback()
}

$(function () {
  let socket = io()
  let nextMessageTime = Date.now()

  $('form').submit(() => {

    const now = Date.now()

    if (now > nextMessageTime) {
      const message = $('#m').val()

      if (message) {
        socket.emit('chat message', message);
        $('#m').val('')
      }

      nextMessageTime = now + 1000
    }

    return false;
  })

  socket.on('chat message', message => {
    $('#messages').append(messageHTML(message))
  })

  $(document).ready(() => {
    $('#username').keypress(ev => {
      if (ev.which == 13) {

        let user = $('#username').val()
        let color = getRandomColor()

        socket.emit('user', {
          user,
          color
        })

        $("#login").hide()
      }
    })

    $("#add-room").hide()

    $('#add-room-btn').click(ev => {
      $('#add-room').show().keypress(ev => {
        if (ev.which == 13) {
          let roomName = $('#room-name').val()

          if (roomName) makeRoom(roomName, () => $('#add-room').hide())
        }
      })
    })
  })

})
