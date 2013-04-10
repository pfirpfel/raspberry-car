var express = require('express')
  , app = module.exports = express()
  , fs = require('fs')
  , sys = require('sys')
  , io = require('socket.io').listen(express)
  ;

app.get('/', function(req, res){
	res.sendfile('html/index.html');
});

app.get(':file(*)',function(req, res, next){
	res.sendfile('html/' + req.params.file);
});

app.listen(80);

