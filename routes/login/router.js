/** @module login/router */
'use strict';

const express = require('express');
const router = express.Router();


// old:
// router.get('/', function(req, res){
//   res.render('index', {list: favorites}); // render using index.dust view, pass favorites array as parameter, identified by "list" in .dust file.
//   // res.render('index'); // render the index.dust view unchanged (statically) as it is
// });

// new:
router.get('/', function(req, res){
  // res.render('index', {list: favorites}); // render using index.dust view, pass favorites array as parameter, identified by "list" in .dust file.
  res.render('login'); // render the index.dust view unchanged (statically) as it is
});






/** router for /root */
module.exports = router;
