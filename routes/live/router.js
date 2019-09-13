/** @module live/router */
'use strict';

const express = require('express');
const router = express.Router();
// require mongoose module"
const mongoose = require('mongoose');

require('../../models/User');
const User = mongoose.model('User');

require('../../models/Picture');
const Picture = mongoose.model('Picture');



// We are sent here through form submission from main user page with Button 'View Other Slideshows'
// Note: POST method used for actual GET purpose to send 'userid' through req.query with form.
//        that is why this request handler may exists as a POST and as a GET if this is desired.
router.post('/', function(req, res) {
  // live view page
  // res.render('index'); // temporary
  const id = req.query.userid;
  User.findById(id, function(err, found) {
    if(err || found === null) {
      res.status(404).end("User not found.");
    }
    else {
      res.render('live_view_slideshows', found);
    }
  });
});




// We are sent here through form submission from main user page with Button 'Broadcast Slideshows'
// Note: POST method used for actual GET purpose to send 'userid' through req.query with form.
//        that is why this request handler may exists as a POST and as a GET if this is desired.
router.post('/control', function(req, res) {
  // live control page
  const id = req.query.userid;
  User.findById(id, function(err, found) {
    if(err || found === null) {
      res.status(404).end("User not found.");
    }
    else {
      res.render('live_control_slideshow', {list: found.pictures});
    }
  });
});


// ALTERNATIVE: pass user and not pictures array to 'live_control_slideshow.dust'
//
// We are sent here through form submission from main user page with Button 'Broadcast Slideshows'
// Note: POST method used for actual GET purpose to send 'userid' through req.query with form.
//        that is why this request handler may exists as a POST and as a GET if this is desired.
// router.post('/control', function(req, res) {
//   // live control page
//   const id = req.query.userid;
//   User.findById(id, function(err, found) {
//     if(err || found === null) {
//       res.status(404).end("User not found.");
//     }
//     else {
//       res.render('live_control_slideshow_alt', found);
//     }
//   });
// });









/** router for /root */
module.exports = router;
