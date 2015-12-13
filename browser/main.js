var io = require('socket.io-client');
var Handlebars = require('handlebars');
var parseAddress = require('../views/parseAddress.js');

var socket = io();


function addToList(item) {
  list  = document.getElementById('playlist');
  var entry = document.createElement('img');
  var img = item.prev;
  entry.setAttribute('src', img);
  entry.setAttribute('width', '200');
  entry.setAttribute('height', '150');

  list.appendChild(entry);
}

function sendData() {
  var songText = document.getElementById('songText');
  var urlPre = 'http://img.youtube.com/vi/' + parseAddress(songText.value) + '/0.jpg';
  var data = {url: songText.value, prev: urlPre};
  if (data.url !== '') {
    socket.emit('add song', data);
    addToList(data);
    songText.value = "";
  }
}

document.addEventListener('DOMContentLoaded', function() {

  if (window.location.pathname === '/') {
    var playlistT = document.getElementById('playlistTemplate');
    var source   = playlistT.innerHTML;
    var template = Handlebars.compile(source);

    socket.on('start', function(data) {
      playlistT.innerHTML = template(data);
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

    socket.on('delete', function() {
      console.log('delete on list');
      var t = document.querySelector('#playlist');
      if (t.children.length > 0)
        t.removeChild(t.children[0]);
    });

  } else if (window.location.pathname === '/play') {
    window.socket = socket;

    socket.on('start', function(data) {
      for (var i = 0, f; f = data.playlist[i]; ++i) {
        window.data.push(parseAddress(f.url));
      }
      if (window.data.length > 0) {
        player.loadVideoById(window.data.pop());
      }
    });

    socket.on('added', function(data) {
      window.data.push(parseAddress(data.url));
      if (player.getPlayerState() < 1)
        player.loadVideoById(window.data.pop());
    });

    socket.on('delete', function() {
      console.log('delete on player');
      window.data.pop();
    });
  }

});
