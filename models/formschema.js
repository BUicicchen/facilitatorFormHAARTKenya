var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var express = require('express');
// app.use(express.bodyParser());
//
// app.post('/', function(request, response){
//   console.log(request.body.data);
// });

var formschema = new Schema({
  // date: Date,
  workshop_date: Date,
  workshop_venue: String,
  workshop_type: String, //each category represented as a number
  // fname: String,
  // lname: String,
  town: String,
  county: String,
  // latitude: Number,
  // longitude: Number,
  targetgroup: String,
  // agegroup: String,
  fadult: String, //number of female adults
  // fchild: Number, //number of female children
  madults: String, // number of male adults
  types_exploitation : String, // Types of exploitation
  types_trafficking : String,
  source_v_destination : String, // Is this the area where you are primarily source or destination
  // mchild: Number, // number of male children
  // totalparticipation: Number,
  // exploitation-type: Number,
  trafficking_type: String, // Trafficker type
  // source-destination: Number,
  // destination: Number,
  // source: Number,
  // foreign: Number, //0 for Kenyan, 1 for Foreigner
  victim_type : String,
  // victim-gender: Number, //male,female, both
  // victim-adult: Number, //0 for child, 1 for adult
  // victim-wealth : Number, //0 for poor, 1 for neither, 2 for rich
  // victim-refugee : Boolean,
  // victim-orphans: Boolean,
  // victim-disabled: Boolean,
  // victim-lgbtq: Boolean,
  // traffick-method: Number, //0 for Deception, 1 for coercion/force, 2 for abduction, 3 for abuse of power
  biggest_need: Number, // 0:lack of awareness, 1:corruption, 2:lack of services for victims, 3:shame/stigmatization  lastName: String
  //Change these around and add more fields that you may need for an account here!!
});

//If you need another mongo collection, simply make another file like this in the models folder!

// Account.plugin(passportLocalMongoose);




module.exports = mongoose.model("formschema", formschema);
