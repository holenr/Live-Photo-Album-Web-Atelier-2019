/** @module models/index.js
* Loads all models
*/
'use strict';

const mongoose = require('mongoose');

require('./Picture');
require('./User');

module.exports = {
  'User' : mongoose.model('User'),
  'Picture' : mongoose.model('Picture')
}
