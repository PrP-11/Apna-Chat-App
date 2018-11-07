var express = require('express');
var socket = require('socket.io');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
// App setup
var app = express();
var server = app.listen(3000, function(){
  console.log('listening to port 3000');
});

// set up view engine
app.set('view engine', 'ejs');

// cookie session
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () =>{
  console.log('connected to mongodb');
});

// Static files
app.use('/public', express.static('public'));

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

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
