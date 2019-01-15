var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");

var Account = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  type: String
  //Change these around and add more fields that you may need for an account here!!
});

//If you need another mongo collection, simply make another file like this in the models folder!

// Account.plugin(passportLocalMongoose);

module.exports = mongoose.model("Account", Account);

// Account.methods.createUser = function(newUser, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(newUser.password, salt, function(err, hash) {
//       newUser.password = hash;
//       newUser.save(callback);
//     });
//   });
// };
//
// Account.methods.getUserByEmail = function(email, callback) {
//   let Obj = { email: email };
//   Account.findOne(Obj, callback);
// };
//
// Account.methods.comparePassword = function(password, hash, callback) {
//   bcrypt.compare(password, hash, function(err, isMatch) {
//     if (err) throw err;
//     callback(null, isMatch);
//   });
// };
//
// Account.methods.getUserById = function(id, callback) {
//   Account.findById(id, callback);
// };
