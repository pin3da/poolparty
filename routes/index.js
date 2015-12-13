
var list = { playlist: [] };

module.exports = function(app, io) {
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/play', function(req, res) {
    res.render('play');
  });

  io.on('connection', function(socket) {
    socket.emit('start', list);
    console.log('a user connected');
    socket.on('add song', function(data) {
      console.log('Add song');
      list.playlist.push(data);
      socket.broadcast.emit('added', data);
    });
  });
};
