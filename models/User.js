/** @constructor
* @augments UserSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const FavoritesSchema = exports.FavoritesSchema = new Schema(
const UserSchema = new Schema(
  {
    // old:
    //
    // note: all fields optional by default (required: false), unless explicitly specified true.
    // also: do not have to create _id field anymore, as this is done automatically by db.
    // dataURL: {type: String, required: true},
    // name: {type: String, required: true, default: ""},
    // bookmarked: {type: Boolean, default: false},
    // dateCreated: {type: Date, required: true, default: Date.now},
    // links: {type: Object, default: {}} // example: links = [{"rel": "self", {"href": "localhost:3000/favorites/" + element.id}}]

    // new:
    username: {type: String, required: true},
    password: {type: String, required: true},
    pictures: {type: Array, default: []}
  }
);

// register model for the FavoritesSchema schema
// -> Create the Collection "Favorites" using FavoritesSchema
mongoose.model('User', UserSchema);

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
