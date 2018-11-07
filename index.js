var express = require('express');
var socket = require('socket.io');
const authRoutes = require('./routes/auth-routes');

// App setup
var app = express();
var server = app.listen(3000, function(){
  console.log('listening to port 3000');
});

// set up voew engine
app.set('view engine', 'ejs');

// Static files
app.use('/public', express.static('public'));

// set up routes
app.use('/auth', authRoutes);

//Socket setup
var io = socket(server);

io.on('connection', function (socket){
  console.log('New user has connected', socket.id);
  socket.on('chat', function(data){
    io.sockets.emit('chat', data);
  });
  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data);
  });
});

// create home route
app.get('/', (req, res) =>{
  res.render('home', {user: req.user});
});
