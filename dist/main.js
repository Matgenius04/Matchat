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
  socket.on('chat message', msg => {
    $('#messages').append($('<li>').text(msg))
  })
})

$(document).ready(() => {
  $('#username').keypress(ev => {
    if (ev.which == 13) {
      $("#popup").hide()
    }
  })
})
