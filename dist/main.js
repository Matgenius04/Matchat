const messageHTML = ({
  sender,
  msg,
  color
}) => {

  console.log(`${sender}: ${msg}`);

  return $('<li>')
    .append($(
      `<div class="message">
        <span class="user" style="color: ${color}">${sender}</span>&nbsp;-&nbsp;<span>${msg}</span>
      </div>
    `));
};

let id;

const getRandomColor = () => {
  const rand = (min, max) => min + Math.random() * (max - min);

  let h = rand(1, 360);
  let s = 100;
  let l = rand(3, 6) * 10;

  return `hsl(${h},${s}%,${l}%)`;
};

const makeRoom = (roomname, callback, server) => {

  console.log("added room " + `${roomname}`);

  if (!server) {
    io().emit('make room', {
      room: roomname,
      pass: null
    });
  } else {
    $('#rooms').append($(`
    <li class="room">
      <span class="roomname">${roomname}</span>
    </li>
  `));
  }

  callback();
};

const joinRoom = (name, pass) => {
  io().emit('join', {
    room: name,
    pass: pass,
    id: id
  })
}

$(function () {
  let socket = io();
  let nextMessageTime = Date.now();

  $('form').submit(() => {

    const now = Date.now();

    if (now > nextMessageTime) {
      const message = $('#m').val();

      if (message) {
        socket.emit('chat message', {msg:message, id: id});
        $('#m').val('');
      }

      nextMessageTime = now + 1000;
    }

    return false;
  });

  socket.on('chat message', message => {
    $('#messages').append(messageHTML(message));
    console.log('got message')
  });

  $(document).ready(() => {
    $('#username').keypress(ev => {
      if (ev.which == 13) {

        let user = $('#username').val();
        let color = getRandomColor();

        socket.emit('user', {
          user,
          color
        });

        $("#login").hide();
      }
    });

    $("#add-room").hide();

    $('#add-room-btn').click(ev => {
      $('#add-room').show().keypress(ev => {
        if (ev.which == 13) {
          let roomName = $('#room-name').val();

          if (roomName) makeRoom(roomName, () => $('#add-room').hide(), false);

          joinRoom($('#room-name').val(), null /*replace with password*/ );

          $('#room-name')[0].value = null;
        }
      });
    });
  });
  socket.on('getId', idd => {
    id = idd;
  })

  socket.on('new-room', data => {
    makeRoom(data.name, () => {}, true);
  })
});