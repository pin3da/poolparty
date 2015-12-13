var io = require('socket.io-client');
var Handlebars = require('handlebars');

var socket = io();

function addToList(list, item) {
  var entry = document.createElement('li');
  entry.appendChild(document.createTextNode(item.url));
  list.appendChild(entry);
}

document.addEventListener('DOMContentLoaded', function() {

  if (window.location.pathname === '/') {
    var playlist = document.getElementById('playlist');
    var source   = playlist.innerHTML;
    var template = Handlebars.compile(source);

    socket.on('start', function(data) {
      console.log("Fill the list");
      playlist.innerHTML = template(data);
      // console.log(data);
    });

    var songText = document.getElementById('songText');
    var send = document.getElementById('sendButton');
    send.addEventListener('click', function() {
      var data = {url: songText.value};
      socket.emit('add song', data);
      addToList(playlist, data);
    });

    socket.on('added', function(data) {
      addToList(playlist, data);
    });
  }

});
