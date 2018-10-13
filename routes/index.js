var express = require("express");
var passport = require("passport");
var Account = require("../models/account");
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
  alert("Not done yet!");
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

//This is just a sanity check to make sure things work
router.get("/ping", function(req, res) {
  res.status(200).send("pong!");
});

// Follow the examples above to add more pages/routes as necessary!

module.exports = router;
