/** @constructor
* @augments PictureSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const FavoritesSchema = exports.FavoritesSchema = new Schema(
const PicturesSchema = new Schema(
  {
    dataURL: {type: String, required: true},
    userId: {type: String, required: true},
    originalname: {type: String}
  }
);

// register model for the FavoritesSchema schema
// -> Create the Collection "Favorites" using FavoritesSchema
mongoose.model('Picture', PicturesSchema);

// remember to require "Favorites" collection in another module where you want to use it with:
// require("../models/Favorites");

// use the "Favorites" collection with:
// var favorites = mongoose.model("Favorites");


// TEMPLATE SCHEMA DEFINITION (EXAMPLE FROM SLIDES LECTURE MongoDB):
//

// var CommentsSchema = new mongoose.Schema ({
//    comment    : { type: String, required: true },
//    created_at : { type: Date, default: Date.now }
// });

// var AuthorsSchema = new mongoose.Schema ({
//    name
//    phone
//    email
// });

// var BlogPostSchema = new mongoose.Schema({
// //reference to author schema
// _author: { type: Schema.Types.ObjectId, ref: 'Author' },
// title : String,
// body : String,
// created_at : Date,
// comments : [CommentsSchema]
// });
// //Create the Collection 􏰁BlogPost􏰂 using BlogPostSchema
// mongoose.model('BlogPost', BlogPostSchema);
// //use the BlogPost collection
// var BlogPost = mongoose.model('BlogPost');
