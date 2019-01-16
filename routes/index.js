var express = require("express");
var passport = require("passport");
var formSchema = require("../models/formschema");
var accountSchema = require("../models/account");
var router = express.Router();
var multer = require("multer");
var bcrypt = require("bcrypt-nodejs");
var LocalStrategy = require("passport-local").Strategy;
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mhendrickbu@gmail.com",
    pass: process.env.PASS
  }
});

var rand, mailOptions, host, link;

// A HELPFUL GUIDE: https://mherman.org/blog/user-authentication-with-passport-dot-js/#add-routes
//PLZ
var createUser = function(newUser, req, rand, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, null, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
  host = req.get("host");
  link =
    "http://" +
    req.get("host") +
    "/verify?id=" +
    rand +
    "&name=" +
    newUser.username;
  mailOptions = {
    to: "mhendric@bu.edu",
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
};

var getUserByEmail = function(email, callback) {
  let Obj = { username: email };
  accountSchema.findOne(Obj, callback);
};

var comparePassword = function(password, hash, callback) {
  bcrypt.compare(password, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

var getUserById = function(id, callback) {
  accountSchema.findById(id, callback);
};
passport.use(
  "adminLogin",
  new LocalStrategy(
    {
      usernameField: "usernameAdmin",
      passwordField: "passwordAdmin",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      getUserByEmail(email, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        comparePassword(password, user.password, function(err, isMatch) {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  )
);

passport.use(
  "facilitatorLogin",
  new LocalStrategy(
    {
      usernameField: "usernameFacilitator",
      passwordField: "passwordFacilitator",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      getUserByEmail(email, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        comparePassword(password, user.password, function(err, isMatch) {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  getUserById(id, function(err, user) {
    done(err, user);
  });
});
//PLZ

router.get("/", function(req, res) {
  //This is the home page
  if (req.user && req.user.valid && req.user.type.toLowerCase() == "admin") {
    res.redirect("/administratorPage");
  } else if (
    req.user &&
    req.user.valid &&
    req.user.type.toLowerCase() == "facilitator"
  ) {
    res.redirect("/form");
  } else {
    res.render("index");
  }
});

router.post(
  "/facilitatorLogin",
  passport.authenticate("facilitatorLogin", {
    failureRedirect: "/"
  }),
  function(req, res) {
    res.redirect("/form");
  }
);

router.post(
  "/adminLogin",
  passport.authenticate("adminLogin", {
    failureRedirect: "/"
  }),
  function(req, res) {
    res.redirect("/administratorPage");
  }
);

router.post("/", function(req, res) {
  if (
    req.body.registerEmailFacilitator &&
    req.body.registerEmailFacilitator.length >= 16
  ) {
    var email = req.body.registerEmailFacilitator;
    var first = req.body.registerFirstNameFacilitator;
    var last = req.body.registerLastNameFacilitator;
    if (
      req.body.registerPasswordFacilitator !=
      req.body.registerConfirmPasswordFacilitator
    ) {
      res.redirect("/");
    }
    var pass = req.body.registerPasswordFacilitator;
    rand = Math.floor(Math.random() * 100 + 54);

    var newAccount = new accountSchema({
      firstName: first,
      lastName: last,
      username: email,
      password: pass,
      rand: rand,
      valid: false,
      type: "Facilitator"
    });
    createUser(newAccount, req, rand, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });
    res.redirect("/form");
  } else if (
    req.body.registerEmailAdministrator &&
    req.body.registerEmailAdministrator.length >= 16
  ) {
    var email = req.body.registerEmailAdministrator;
    var first = req.body.registerFirstNameAdministrator;
    var last = req.body.registerLastNameAdministrator;
    if (
      req.body.registerPasswordAdministrator !=
      req.body.registerConfirmPasswordAdministrator
    ) {
      res.redirect("/");
    }
    var pass = req.body.registerPasswordAdministrator;
    rand = Math.floor(Math.random() * 100 + 54);

    var newAccount = new accountSchema({
      firstName: first,
      lastName: last,
      username: email,
      password: pass,
      rand: rand,
      valid: false,
      type: "Admin"
    });
    createUser(newAccount, req, rand, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });
    res.redirect("/administratorPage");
  }
  res.redirect("/");
});

router.get("/form", function(req, res) {
  //This is the route to load form
  if (req.user && req.user.valid) {
    res.render("form", { admin: req.user.type.toLowerCase() == "admin" });
  } else {
    res.redirect("/");
  }
});

router.post("/form", function(req, res) {
  //A post request for the form actually collect the data and store it in Mongo
  var workshop_date = req.body.workshop_date; //convert to name
  var workshop_venue = req.body.workshop_venue;
  var workshop_type = req.body.workshop_type;
  var fname = req.user.firstName;
  var lname = req.user.lastName;
  var town = req.body.town;
  var county = req.body.county;
  var agegroup = req.body.age_group;
  var targetgroup = [
    req.body.womenGroup,
    req.body.churchGroup,
    req.body.firstResponders,
    req.body.children,
    req.body.communityGroup
  ];
  var female_participants = req.body.female_participants;
  var male_participants = req.body.male_participants;
  var other_participants = req.body.other_participants;
  var total_participants = req.body.total_participants;
  var typesExploit = req.body.typesOfExploitation; //other
  var types_trafficking = req.body.typesOfTrafficking;
  var source = req.body.source;
  var destination = req.body.destination;
  var sourceExplanation = req.body.source_box;
  var destinationExplantion = req.body.destination_box;
  var trafficking_type = req.body.whoAreTheTraffickers;
  var victim_type = req.body.whoAreTheVictims; //others
  var method = req.body.howAreTheyTrafficked;
  var bigNeed = req.body.biggestNeed;
  var timeStamp = req.body.timeStamp;
  var form = {
    workshop_date: workshop_date,
    workshop_venue: workshop_venue, //each category represented as a number
    workshop_type: workshop_type, //each category represented as a number
    fname: fname,
    lname: lname,
    town: town,
    county: county,
    targetgroup: targetgroup,
    agegroup: agegroup,
    female_participants: female_participants, //number of female participants
    male_participants: male_participants, // number of male participants
    other_participants: other_participants,
    total_participants: total_participants,
    types_exploitation: typesExploit, // Types of exploitation
    types_trafficking: types_trafficking,
    source: source, // Is this the area where you are primarily source or destination
    destination: destination,
    sourceExplanation: sourceExplanation,
    destinationExplantion: destinationExplantion,
    trafficking_type: trafficking_type, // Trafficker type
    victim_type: victim_type,
    traffick_method: method, //0 for Deception, 1 for coercion/force, 2 for abduction, 3 for abuse of power
    timeStamp: timeStamp,
    biggest_need: bigNeed
  };

  formSchema.create(form, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
  res.redirect("/dataVisualizationPage");
});

router.get("/logout", function(req, res) {
  //Def need a logout feature for security purposes
  req.logout();
  res.redirect("/");
});

//For Cici's code
router.get("/dataVisualizationPage", function(req, res) {
  if (req.user && req.user.valid) {
    var data = [];
    formSchema.find({}, function(err, forms) {
      forms.forEach(function(form) {
        data.push(form);
      });
      res.render("dataVisualizationPage", {
        admin: req.user.type.toLowerCase() == "admin",
        name: req.user.firstName,
        data: data
      });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/administratorPage", function(req, res) {
  if (req.user && req.user.valid && req.user.type.toLowerCase() == "admin") {
    var allAccounts = [];
    accountSchema.find({}, function(err, users) {
      users.forEach(function(user) {
        allAccounts.push(user);
      });

      res.render("administratorPage", {
        accounts: allAccounts,
        user: req.user.firstName
      });
    });
  } else {
    res.redirect("/");
  }
});

router.post("/adminEdit", function(req, res) {
  var update = "";
  if (req.body.editPos == "1") {
    update = "Facilitator";
  } else {
    update = "Admin";
  }
  accountSchema.findOneAndUpdate(
    { username: req.body.user },
    { $set: { type: update } },
    { new: true },
    function(err, user) {
      console.log(user);
    }
  );
  res.redirect("/");
});

router.post("/adminDelete", function(req, res) {
  accountSchema.deleteOne({ username: req.body.user }, function(err, user) {
    console.log(user);
  });
  res.redirect("/");
});

router.get("/verify", function(req, res) {
  host = req.get("host");
  console.log(req.protocol + ":/" + req.get("host"));
  console.log(req.query.name);
  var newNum = 0;
  accountSchema.findOne({ username: req.query.name }, function(err, user) {
    if (err) {
      res.redirect("/");
    } else {
      newNum = user.rand;
    }
    console.log(req.protocol + "://" + req.get("host"));
    console.log("http://" + host);
    if (req.protocol + "://" + req.get("host") == "http://" + host) {
      console.log("Domain is matched. Information is from Authentic email");
      console.log(req.query.id);
      console.log(newNum);

      if (req.query.id == newNum) {
        console.log("email is verified");
        accountSchema.findOneAndUpdate(
          { username: req.query.name },
          { $set: { valid: true } },
          { new: true },
          function(err, user) {
            console.log(user);
          }
        );
        res.end(
          "<h1>Email " + req.query.name + " is been Successfully verified"
        );
      } else {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
      }
    } else {
      res.end("<h1>Request is from unknown source");
    }
  });
});

//This is just a sanity check to make sure things work
router.get("/ping", function(req, res) {
  res.status(200).send("pong!");
});

// Follow the examples above to add more pages/routes as necessary!

module.exports = router;
