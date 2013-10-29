var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/static/index.html');
});
app.use('/static', express.static('static'));

var client_lock = null;

io.sockets.on('connection', function (socket) {
  if(client_lock === null){
	client_lock = socket.id;
	console.log('accepted client: ' + client_lock);
  } else {
	console.log('denied client: ' + client_lock);
  }
  socket.on('control_pressed', function(data){
	if(client_lock === socket.id){
		console.log('client: '
			+ socket.id + ' : '
			+ data['command'] + ':' + data['enable']);
	} else {
		console.log('command ignored from: ' + socket.command);
	}
  });
  socket.on('disconnect', function(data){
	if(client_lock === socket.id){
		client_lock = null;
		console.log('lock freed: ' + socket.id);
	} else {
		console.log('denied client disconnected: ' + socket.id);
	}
  });
});
