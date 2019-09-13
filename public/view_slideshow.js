
/// Make connection:
var socket = io.connect('http://localhost:3000');


// FOR OUTPUT FOR VIEWING USER:
// picture element we want to add output data to
var display = document.getElementById('output_image');

// alternative: output to a div by adding new image with received data to innerHTML:
var output = document.getElementById('output');

var current_Slideshows = document.getElementById('current_Slideshows');



// Listen for events:
socket.on('new_room', function(roomName) {

  var roomWrapper = document.createElement("DIV");
  roomWrapper.id = roomName;

  var newRoom = document.createElement("DIV");
  newRoom.innerHTML = "Slideshow ID: " + roomName;

  var button1 = document.createElement("BUTTON");
  button1.innerHTML = "Connect";

  var button2 = document.createElement("BUTTON");
  button2.innerHTML = "Disconnect";

  var message = document.createElement("P");
  message.innerHTML = "";



  button1.addEventListener('click', function() {
    socket.emit('join', roomName);
    message.innerHTML = "Connected!";
  });

  button2.addEventListener('click', function() {
    socket.emit('leave', roomName);
    message.innerHTML = "Disconnected!";
  });

  roomWrapper.appendChild(newRoom);
  roomWrapper.appendChild(button1);
  roomWrapper.appendChild(button2);
  roomWrapper.appendChild(message);

  current_Slideshows.appendChild(roomWrapper);

  // current_Slideshows.innerHTML += "<div id='" + roomName + "'><p> " + roomName + " </p></div>";

});




socket.on('pic', function(data) {
  console.log("Socket: " + socket.id + " received pic data from server");
  console.log("Adding data to output element.");

  // Method 1:
  // display.src = data.dataURL;
  // display.id = data.imageId;

  //Method 2
  output.innerHTML = "<img alt='slideshow-image-alt' src='" + data.dataURL + "'></img>";
});

socket.on('room_closed', function(roomName) {
  socket.emit('leave', roomName);
  message.innerHTML = "Disconnected!";
});
