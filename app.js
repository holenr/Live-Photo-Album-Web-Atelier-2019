const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const kleiDust = require('klei-dust');
const socket = require('socket.io');
const app = express();

// // multer middleware for handling multipart/form-data:
// // accessable in request as req.file <- returns an object containing various information about the file
// const multer = require('multer'); // for handling multipart/form-data
// // the following two lines will make a Buffer of the entire file available in req.file.buffer
// var storage = multer.memoryStorage();
// var upload = multer({ storage: storage });


//Configure app:
// ***************************************************************************
//
// set up view engine.
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
// app.set('views', './views'); // <- works too
app.engine('dust', kleiDust.dust);


// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/live-photo-album-dev', { useNewUrlParser: true }); // typically localhost would be actual address of external server.
// { useNewUrlParser: true } added above according to DeprecationWarning from node running server in console.


// Configure application to log all requests and show the corresponding status codes.
// Hint: use the morgan middleware.
app.use(logger('dev'));


// ROOT HANDLER:
// Static files:
// Configure application to serve ("receive"/"use") static assets from the public
// folder using the static middleware. (accessed through imported express module!)
// these are the "static" components of our app:

// serve static (public) assets from '/public' when connecting to GET '/':
app.use(express.static(path.join(__dirname, 'public'))); // <- serves index.html when doing to GET '/'
// app.use(express.static("./public")); // <- works too


// body-parser middleware allows parsing of *json-data* sent in POST request
// body for example to work. (i.e. handle it in request handler function)
// example: json request body data has this form: {firstname: "Roland", lastname: "Holenstein"}
// access it in request handler: req.body.firstname -> "Roland"
app.use(bodyParser.json());

// body-parser middleware allows parsing of *text-data* sent in POST request
// body for example to work (i.e. handle it in request handler function)
// NOT SURE how to access it exactly: req.body.<something> returns text?
app.use(bodyParser.text());

// body parser middleware allows *url-encoded-form-data* to be
// read in handler for POST request to respective route (i.e. "address/") from body of POST request.
// content type: application/x-www-form-urlencoded
// form data is sent in req body in the same format as a *query string* in the url of a get request for example
// i.e.: firstname=Harry&lastname=Potter&email=harrypotter@howgwarts.com&homepage=www.howidefeatedvoldemort.co.uk
// For example: req.body.firstname -> "Harry" can be read in request handler from url-encoded-form-data line above
app.use(bodyParser.urlencoded({extended: true}))


// Example from Handson 6:
// override with POST having ?_method=DELETE or ?_method=PUT
// this is used for POST method from address_edit_form.dust view
// to route: /address/:id?_method=PUT
// to be overriden to use PUT method instead to /address/:id
// or method DELETE to /address/:id
// when the respective query strings are found: ?_method=PUT or ?_method=DELETE
// (use ? - perhaps to reuse same dust file for multiple methods/ routes i.e. uses like POST or DELETE)
// - I can't think of another way except through forms to force the HTTP method
//   to be DELTE or PUT. As it is GET by default from address bar.
app.use(methodOverride('_method'));



// Initialize routers here
// const rootRouter = require("./routes/root/router");
// app.use('/', rootRouter);


const registerRouter = require("./routes/register/router");
app.use('/register', registerRouter);

const loginRouter = require("./routes/login/router");
app.use('/login', loginRouter);

const accountRouter = require("./routes/account/router");
app.use('/account', accountRouter);

const userRouter = require("./routes/user/router");
app.use('/user', userRouter);

const randomRouter = require("./routes/random/router");
app.use('/random', randomRouter);

const liveRouter = require("./routes/live/router");
app.use('/user/:userid/live', liveRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// Server setup and starting server:
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


// socket setup:
var io = socket(server);

io.on('connection', function(socket) {
  console.log('made socket connection with: ' + socket.id);
  console.log('');

  socket.on('disconnect', function() {
   console.log('client disconnected: ' + socket.id);
   console.log('');
  });

  socket.on('new_room', function(roomName) {
    // server received new room initialization request from a host.
    // send new roomName to all connected clients except the one that sent it (host):
    console.log('Server received new room setup request, roomname: ' + roomName);
    console.log('Sending roomname to all other connected clients');
    console.log('');
    socket.broadcast.emit('new_room', roomName); // send new roomName to all connected clients except the one that sent it (host):
  });

  // a client (slideshow viewer) has sent a join room request with name 'roomName' to server,
  // Add client to that room:
  socket.on('join', function(roomName) {
    console.log('Server received join room request from: ' + socket.id + ', to join room: ' + roomName);
    console.log('');
    socket.join(roomName);
  });

  socket.on('leave', function(roomName) {
    console.log('Server received leave room request from: ' + socket.id + ', to leave room: ' + roomName);
    console.log('');
    socket.leave(roomName);
  });


  socket.on('room_closed', function(roomName) {
    io.sockets.in(roomName).emit('room_closed', roomName);
  });


  socket.on('pic', function(data) {
    console.log('server received pic event from: ' + socket.id);
    // console.log('data: ' + data);                    // dataURL is too many lines!
    // console.log('data.dataURL: ' + data.dataURL);
    // console.log('data.imageId: ' + data.imageId);
    console.log('Sending data to all subscribed clients to ' + data.room + '...');
    console.log('');
    // io.sockets.emit('pic', data); // sent to all connected clients
    io.sockets.in(data.room).emit('pic', data); // send data to all sockets in room room including sender.

  });
});



module.exports = app;
