/** @module account/router */
'use strict';

const express = require('express');
const router = express.Router();
// require mongoose module"
const mongoose = require('mongoose');

require('../../models/User');
const User = mongoose.model('User');

// new:
router.post('/register', function(req, res){
  // handle form data in req.body sent with registration form from '/register'
  // check if the username already exists:
  //       - YES: redirect back to '/register' page (perhaps modified with hint that username already exists)
  //       - NO: -> add new username and password to database
  //             -> redirect to '/login' (Note: perhaps done doubly, remember 'formaction' attribute from registrationform submit button)
  //              - YES: redirect to 'user/{username}'
  const filter = {};
  if(req.body.username && req.body.password) {
    filter.username = req.body.username;
    // e.g.: filter = {username: "rollie94"}
  }
  else {
    res.status(400).end("Bad request. No username and/or password received.");
    // res.redirect(301, "/register");
  }

  User.find(filter, function(err, found) {

    if(err) {
      res.status(500).end("Internal server error.");
    }
    if(found.length === 0) {
      // Note: Not quite sure if best idea to put these above two conditions together.
      // username not found or error. Create a new username and add it with password to database.
      let newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });
      // save new object:
      newUser.save(function(err, saved) {
        if(err) {
          // handle error from trying to save:
          res.status(500).end("Internal server error trying to save.");
        }
        else {
          //
          // res.status(201).json(saved);
          // alternative: redirect to login page.
          res.redirect(302, "/login");
        }
      });
    }

    else {
      // username already exists. Try again from that page.
      res.redirect(302, "/register");
    }
  });

});



router.post('/login', function(req, res){
  // handle form data in req.body sent with login form from '/login'
  // Check if username exists in database and matches password.
  //   - YES: redirect to 'user/{username}'
  //   - No: redirect back to login page (perhaps modified with hint that username or password are incorrect)
  const filter = {};
  if(req.body.username && req.body.password) {
    filter.username = req.body.username;
    filter.password = req.body.password;
    // e.g.: filter = {username: "rollie94", password: "12345"}
  }
  else {
    res.status(400).end("Bad request. No username and/or password received.");
    // res.redirect(301, "/register");
  }

  User.find(filter, function(err, found) {

    if(err) {
      res.status(500).end("Internal server error.");
    }
    if(found.length === 0) {
      // username and/ or password do not match
      res.redirect(302, "/login");
    }
    else {
      // username and password exist and match. Redirect to '/user/{username}'
      res.redirect(302, "/user/" + found[0]._id + "");
    }
  });
});






/** router for /root */
module.exports = router;
