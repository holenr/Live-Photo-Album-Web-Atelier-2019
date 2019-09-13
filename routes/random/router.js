/** @module random/router */
'use strict';

const express = require('express');
const router = express.Router();
// require mongoose module"
const mongoose = require('mongoose');

require('../../models/User');
const User = mongoose.model('User');

require('../../models/Picture');
const Picture = mongoose.model('Picture');




router.get('/', function(req, res) {

  // Retrieve random picture manually:
  Picture.find({}, function(err, found) {

    if(err) {
      res.status(500).end("Internal server error.");
    }
    if(found.length === 0) {
      res.status(404).end("No pictures found.");
    }
    else {
      // found object is array of user objects:
      let pictureCount = found.length;
      console.log("picture count: " + pictureCount);
      var r = Math.floor(Math.random() * pictureCount); // 2. a random number between 0 and n (included)
      console.log("Random number: " + r);

      let randomPicture = found[r];

      if(randomPicture != undefined && randomPicture != null) {
        console.log("Random picture id: " + randomPicture._id);
        res.render('full_screen_picture', randomPicture);
      }
      else {
        res.status(404).end("Picture not found.");
      }
    }
  });

});




/** router for /random */
module.exports = router;
