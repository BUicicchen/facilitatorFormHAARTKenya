var express = require("express");
var passport = require("passport");
var formSchema = require("../models/formschema");
var router = express.Router();
var multer = require("multer");

// A HELPFUL GUIDE: https://mherman.org/blog/user-authentication-with-passport-dot-js/#add-routes

router.get("/", function(req, res) {
  //This is the home page
  res.render("index");
});

router.get("/form", function(req, res) {
  //This is the route to load form

  res.render("form");
});

router.post("/form", function(req, res) {

  //A post request for the form actually collect the data and store it in Mongo
  console.log("we are here");
  var venue = req.body.element_2
  var workshop = req.body.element_10 //convert to name
  var firstname = req.body.element_3_1
  var lastname  = req.body.element_3_2
  var town = req.body.element_11
  var county = req.body.element_12
  var targetgroup = req.body.element_13
  var agegroup = req.body.element_14
  var fadults = req.body.element_4
  var madults = req.body.element_5

  var form = {venue: venue,
  workshop: workshop, //each category represented as a number
  fname : firstname,
  lname : lastname,
  town: town,
  county: county,
  targetgroup: targetgroup,
  agegroup: agegroup,
  fadult: fadults,
  madults: madults}

  console.log(form);

  // var totalparticipations =parseInt(fadults,10) + parseInt(madults,10)
  //var newform = mongoose.model("entries", formSchema);

  formSchema.create(form,function(err,res){
    if (err){
      console.log(err);
    } else{
      console.log(res);
    }
  })
  console.log("We've done the thing");
  res.redirect("/");
});



router.get("/logout", function(req, res) {
  //Def need a logout feature for security purposes
  req.logout();
  res.redirect("/");
});

router.get("/createAccount", function(req, res) {
  //You're gonna need some sort of page or route or workflow to create an account, touch base with
  //your PM to discuss how to implement this.
  console.log("Not done yet!");
  res.redirect("/");
});

router.post("/createAccount", function(req, res) {
  //You're gonna need some sort of page or route or workflow to create an account, touch base with
  //your PM to discuss how to implement this.
  console.log("Not done yet!");
  res.redirect("/");
});

//For Cici's code
router.get("/administratorPage_v1", function(req, res) {
  res.render("administratorPage_v1");
});

router.get("/administratorPage_v2", function(req, res) {
  res.render("administratorPage_v2");
});

//This is just a sanity check to make sure things work
router.get("/ping", function(req, res) {
  res.status(200).send("pong!");
});

// Follow the examples above to add more pages/routes as necessary!

module.exports = router;
