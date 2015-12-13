var io = require('socket.io-client');
var Handlebars = require('handlebars');

var socket = io();

function addToList(item) {
  list  = document.getElementById('playlist');
  var entry = document.createElement('li');
  entry.appendChild(document.createTextNode(item.url));
  list.appendChild(entry);
}

function sendData() {
  var songText = document.getElementById('songText');
  var data = {url: songText.value};
  socket.emit('add song', data);
  addToList(data);
  songText.value = "";
}

document.addEventListener('DOMContentLoaded', function() {

  if (window.location.pathname === '/') {
    var playlistT = document.getElementById('playlistTemplate');
    var source   = playlistT.innerHTML;
    var template = Handlebars.compile(source);

    socket.on('start', function(data) {
      playlistT.innerHTML = template(data);
      // console.log(data);
    });

    var send = document.getElementById('sendButton');
    var songText = document.getElementById('songText');
    send.addEventListener('click', sendData);
    songText.addEventListener('keyup', function(evt) {
      if (evt.keyCode == 13)
        sendData();
    });

    socket.on('added', function(data) {
      addToList(data);
    });
  } else if (window.location.pathname === '/play') {

    socket.on('start', function(data) {
      for (var i = 0, f; f = data.playlist[i]; ++i) {
        window.data.push(parseAddress(f.url));
      }
      if (window.data.length > 0) {
        player.loadVideoById(window.data.pop());
      }
    });

    window.socket = socket;

    socket.on('added', function(data) {
      window.data.push(parseAddress(data.url));
      if (player.getPlayerState() < 1)
        player.loadVideoById(window.data.pop());
    });
  }

});
