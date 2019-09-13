/** @module user/router */
'use strict';

const express = require('express');
const router = express.Router();
// require mongoose module"
const mongoose = require('mongoose');

// multer middleware for handling multipart/form-data:
// accessable in request as req.file <- returns an object containing various information about the file
const multer = require('multer'); // for handling multipart/form-data
// the following two lines will make a Buffer of the entire upload file available in req.file.buffer
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

require('../../models/User');
const User = mongoose.model('User');

require('../../models/Picture');
const Picture = mongoose.model('Picture');

// Socket setup:
// var app = require('../../app.js'); // to retrieve server variable from app.js
// var socket = require('socket.io');
// var io = socket(app.server);
// // Wait for socket connection on this server side from any logged in user:
// io.on('connection', function(socket) {
//   console.log('made socket connection with: ' + socket.id);
// })



// new:
router.get('/:userid', function(req, res) {
  const id = req.params.userid;
  User.findById(id, function(err, found) {
    if(err || found === null) {
      res.status(404).end("No object found.");
    }
    else {
      // res.render('index'); // render the index.dust view unchanged (statically) as it is
      res.render('users_list', {list: [found]}); // render using user.dust view, pass found array as parameter, identified by "list" in .dust file.
    }
  });
});




router.post('/:userid/pictures', upload.single('picture'), function(req, res) {

  // *************************************************************************
  // Attempt function to make picture dataURL available:
  // *************************************************************************
  // const img = req.body.picture;
  // // get dataURL representation of received picture:
  // // var canvas = document.createElement("canvas");
  // canvas.width = img.width;
  // canvas.height = img.height;
  // // Copy the image contents to the canvas
  // var ctx = canvas.getContext("2d");
  // ctx.drawImage(img, 0, 0);
  // var dataURL = canvas.toDataURL("image/png");
  // // dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

  // User.findById(id).then(
  //
  //   function(found) {
  //     let newPicture = new Picture({
  //       dataURL: req.body.picture,
  //       // dataURL: dataURL,
  //       userId: id
  //     });
  //     return newPicture.save();
  //
  //   },
  //

  const id = req.params.userid;

  console.log(req.file); // { fieldname: 'picture', originalname: '_DSC2397.JPG', encoding: '7bit', mimetype: 'image/jpeg',buffer: <Buffer ff d8 ff e1 b3 7a 45 78 69 66 00 00 49 49 2a 00 08 00 00 00 0f 00 0e 01 02 00 20 00 00 00 c2 00 00 00 0f 01 02 00 05 00 00 00 e2 00 00 00 10 01 02 00 ... >, size: 7897088 }

  User.findById(id, function(err, found) {
    if(err || found === null) {
      res.status(404).end("No object found.");
    }
    else {
      let newPicture = new Picture({
        // works!
        dataURL: "data:image/jpg;base64," + req.file.buffer.toString('base64'), // works!
        userId: id,
        originalname: req.file.buffer.originalname
      });

      // save new object to database 'Picture' collection:
      newPicture.save(function(err, saved) {
        if(err) {
          // handle error from trying to save:
          res.status(500).end("Internal server error trying to save picture.");
        }
        else {
          // add new picture to user's pictures array
          found.pictures.push(newPicture);
          // update changes to user in database 'User' collection.
          found.save(function(err, saved2) {
            if(err) {
              // handle error from trying to save:
              res.status(500).end("Internal server error trying to save user.");
            }
            else {
              //
              // res.status(201).json(saved2);
              // alternative: redirect
              res.redirect("/user/" + id + "/pictures");
            }
          });

        }

      });
    }
  });

  // *************************************************************************
  //  Above using promises and other code (incomplete)
  // *************************************************************************
  //
  //   function(err) {
  //     res.status(404).end("No object found.");
  //
  //   }).then(
  //     function(saved) {
  //
  //     }).catch(
  //       function(err) {
  //         res.status(500).end("Internal server error trying to save.");
  //       });
  // };
  //
  //
  //   , function(err, found) {
  //   if(err || found === null) {
  //     res.status(404).end("No object found.");
  //   }
  //   else {
  //     let newPicture = new Picture({
  //       dataURL: req.body.picture,
  //       // dataURL: dataURL,
  //       userId: id
  //     });
  //
  //     // save new object to database 'Picture' collection:
  //     newPicture.save(function(err, saved) {
  //       if(err) {
  //         // handle error from trying to save:
  //         res.status(500).end("Internal server error trying to save picture.");
  //       }
  //       else {
  //         //
  //         res.status(201).json(saved);
  //         // alternative: redirect to login page.
  //         // res.redirect(302, "/login");
  //       }
  //
  //     });
  //
  //     // add new picture to user's pictures array
  //     found.pictures.push(newPicture);
  //     // update changes to user in database 'User' collection.
  //     found.save(function(err, saved) {
  //       if(err) {
  //         // handle error from trying to save:
  //         res.status(500).end("Internal server error trying to save user.");
  //       }
  //       else {
  //         //
  //         res.status(201).json(saved);
  //         // alternative: redirect
  //         // res.redirect("/favorites");
  //       }
  //     });
  //   }
  // });


});



router.get('/:userid/pictures', function(req, res) {
  const id = req.params.userid;
  User.findById(id, function(err, found) {
    if(err || found === null) {
      res.status(404).end("User not found.");
    }
    else {
      res.render('pictures_list', {list: found.pictures});
    }
  });
});



router.get('/:userid/pictures/:pictureid', function(req, res) {
  const userid = req.params.userid;
  const pictureid = req.params.pictureid;

  User.findById(userid, function(err, foundUser) {
    if(err || foundUser === null) {
      res.status(404).end("User not found in db.");
    }
    else {
      foundUser.pictures.forEach(function(picture) {
        if(picture._id == pictureid) {
          // user has this picture saved: remember we can retrieve it both from within a 'User' collection
          //                              or also directly from 'Picture' collection.

          // Retrieve it again using database accessing 'Picture' collection:
          // (Acts as small test wether pictures stored in db Picture collection correspond
          // to pictures stored inside a users in User collection)
          // Picture.findById(pictureid, function(err, foundPicture) {
          //   if(!err && foundPicture !== null) {
          //     res.render('full_screen_picture', foundPicture);
          //   }
          // });

          // display same picture found in foundUser.pictures:
          res.render('full_screen_picture', picture);
        }

      });
      // picture with pictureid not found in database inside this user.
      res.status(404).end("Picture not found under this user.");
    }

  });
});



router.delete('/:userid/pictures/:pictureid', function(req, res) {
  // Note security issue/ may cause bug: A user can try to delete a picture that is not his!
  // Because finding user and picture is not tied together!
  const userid = req.params.userid;
  const pictureid = req.params.pictureid;

  User.findById(userid, function(err, foundUser) {
    if(err || foundUser === null) {
      res.status(404).end("User not found.");
    }
    else {
      Picture.findById(pictureid, function(err, foundPicture) {
        if(err || foundPicture === null) {
          res.status(404).end("Picture not found.");
        }
        else {

          //remove picture from foundUser.pictures array:
          for(let i = 0; i < foundUser.pictures.length; i++) {
            if(foundUser.pictures[i]._id == pictureid) {
              // foundUser.pictures = foundUser.pictures.splice(i, 1);
              foundUser.pictures.splice(i, 1);
            }
          }

          // save updated user
          foundUser.save(function(err, saved) {
            if(err) {
              res.status(500).end("Internal server error trying to save user.");
            }
            else {
              // remove picture from database Picture collection:
              foundPicture.remove(function(err, removed) {
                if(err) {
                  res.status(500).end("Server error trying to remove picture from database.");
                }
                else {
                  // res.status(204).json(saved);
                  res.redirect(302, "/user/" + userid + "/pictures");
                }
              });
            }
          });
        }
      });
    }
  });
});




/** router for /user */
module.exports = router;
