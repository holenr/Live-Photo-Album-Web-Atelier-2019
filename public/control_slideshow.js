

// Make connection:
// var socket = io.connect('http://localhost:3000');

var socket = io.connect('http://localhost:3000');

// create a new custom highly likely to be unique room name:
var r = Math.floor(Math.random() * 100000);
var roomName = r.toString();
console.log(roomName);
console.log("");

// Setup roomname for this slideshow hosting:
// socket.on('connect', function() {
//    // When connectded, send roomname for this slideshow hosting.
//    socket.emit('new_room', roomName);
//    socket.emit('join', roomName);
// });
socket.emit('new_room', roomName);
socket.emit('join', roomName);




// QUERY DOM:

// ELEMENTS TO ADD EVENTLISTENERS TO:
// Method 1:
// -> As below is from dust partial 'picture_control.dust', not sure if it is accessible here...
var pictures = document.getElementsByClassName('selectable_pic');
// Method 2:
// -> As below is from dust partial picture_control.dust', not sure if it is accessible here...
var buttons = document.getElementsByClassName('select_button');
// Method 3:
// -> Element from Dust file 'live_control_slideshow.dust', may be better accessible...
var pictures_wrapper = document.getElementById('pictures_wrapper');


// OUTPUT:
// elements we want to add output data to:
// Method 1:
var display = document.getElementById('output_image');

// Method 2:
// alternative: output to a div by adding new image with received data to innerHTML:
var output = document.getElementById('output');





// EMITT EVENTS:

// //Method 1: Emitt events by clicking on picture:
for(let i = 0; i < pictures.length; i++) {
  pictures[i].addEventListener('click', function() {
    socket.emit('pic', {
      dataURL: pictures[i].src,
      imageId: pictures[i].id,
      room: roomName
    });
  });
}

// pictures.forEach(function(picture) {
//   picture.addEventListener('click', function() {
//     socket.emit('pic', {
//       dataURL: picture.src,
//       imageId: picture.id,
//       room: roomName
//     });
//   });
// });

// Method 2: Emitt events by clicking on button:
// let i = 0;
// let button;
// pictures.forEach(function(picture) {
//   if(i < buttons.length) {
//     button = buttons[i];
//     button.addEventListener('click', function() {
//       console.log("switch to picture button clicked!");
//       console.log("Sending pic data to server.");
//       socket.emit('pic', {
//         dataURL: picture.src,
//         imageId: picture.id,
//         room: roomName
//       });
//     });
//   }
//   i++;
// });




// Method 3: Go through children of pictures_wrapper, add eventlisteners:
// var pics = pictures_wrapper.children;
// for (var i = 0; i < pics.length; i++) {
//   var pic = pics[i];
//   pic.addEventListener('click', function() {
//     console.log(pic);
//     console.log("switch to picture button clicked!");
//     console.log("Sending pic data to server.");
//     socket.emit('pic', {
//       dataURL: pic.src,
//       imageId: pic.id,
//       room: roomName
//     });
//   });
// }



// var pics = pictures_wrapper.childNodes;
//
// var pics_array = Array.from(pics);
// pics_array.forEach(function(pic){
//   pic.addEventListener('click', function() {
//     console.log(pic);
//     console.log("switch to picture button clicked!");
//     console.log("Sending pic data to server.");
//     socket.emit('pic', {
//       dataURL: pic.src,
//       imageId: pic.id
//     });
//   });
// });




// LISTEN FOR EVENTS:
socket.on('pic', function(data) {
  console.log("Socket: " + socket.id + " received pic data from server");
  console.log("Adding data to output element.");

  // Method 1:
  // display.src = data.dataURL;
  // display.id = data.imageId;

  //Method 2
  output.innerHTML = "<img alt='slideshow-image-alt' src='" + data.dataURL + "' width='20%' height='20%'></img>";
});

socket.on('disconnect', function(roomName) {
  console.log("Host disconnnecting from " + roomName);
  socket.emit('room_closed', roomName);
});

socket.on('disconnecting', function(roomName) {
  console.log("Host disconnnecting from " + roomName);
  socket.emit('room_closed', roomName);
});
