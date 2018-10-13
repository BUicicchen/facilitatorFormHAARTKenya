var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var Account = new Schema({
  firstName: String,
  lastName: String
  //Change these around and add more fields that you may need for an account here!!
});

//If you need another mongo collection, simply make another file like this in the models folder!

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model("Account", Account);
