var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(5000);

/*
TODO: serve all files (express?)
*/

function handler (req, res) {
  fs.readFile(__dirname + '/html/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

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
		console.log('client: ' + socket.id + ' : ' +data);
	} else {
		console.log('command ignored from: ' + socket.id);
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
