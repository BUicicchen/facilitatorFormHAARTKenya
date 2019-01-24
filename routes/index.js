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
  host: "smtp.gmail.com",
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
    accountSchema.findOneAndUpdate(
      { username: req.body.user },
      { $set: { lastLogged: new Date() } },
      { new: true },
      function(err, user) {
        console.log(user);
        res.redirect("/form");
      }
    );
  }
);

router.post(
  "/adminLogin",
  passport.authenticate("adminLogin", {
    failureRedirect: "/"
  }),
  function(req, res) {
    accountSchema.findOneAndUpdate(
      { username: req.body.user },
      { $set: { lastLogged: new Date() } },
      { new: true },
      function(err, user) {
        console.log(user);
        res.redirect("/administratorPage");
      }
    );
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
      type: "Admin",
      lastLogged: new Date()
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
  var workshop_date = req.body.workshop_date; //always
  var workshop_venue = req.body.workshop_venue; //always
  var workshop_type = req.body.workshop_type; //always
  var fname = req.user.firstName; //always
  var lname = req.user.lastName; //always
  var town = req.body.town; //always
  var county = req.body.county; //always
  var agegroup = req.body.age_group; //always
  var targetgroup = [
    //Some but not all;
    req.body.womenGroup,
    req.body.churchGroup,
    req.body.firstResponders,
    req.body.children,
    req.body.communityGroup
  ];
  targetgroup = targetgroup.filter(function(el) {
    return el != null;
  });
  var female_participants = req.body.female_participants; //always
  var male_participants = req.body.male_participants; //always
  var other_participants = req.body.other_participants; //always
  var total_participants = req.body.total_participants; //always
  var typesExploit = req.body.typesOfExploitation; // TODO: Fix others
  var other_exploit_box = req.body.other_exploit_box;
  if (other_exploit_box) {
    typesExploit = typesExploit + "," + other_exploit_box;
    typesExploit = typesExploit.replace("other_exploit,", "");
  }
  var types_trafficking = req.body.typesOfTrafficking; //always
  var source = req.body.source; //MAYBE
  if (!source) {
    source = "";
  }
  var destination = req.body.destination; //MAYBE
  if (!destination) {
    destination = "";
  }
  var sourceExplanation = req.body.source_box; //MAYBE
  if (!sourceExplanation) {
    sourceExplanation = "";
  }
  var destinationExplantion = req.body.destination_box; //MAYBE
  if (!destinationExplantion) {
    destinationExplantion = "";
  }
  var trafficking_type = req.body.whoAreTheTraffickers; //always
  var victim_type =
    req.body.whoAreTheVictims + otherVictimsHelper(req.body.other_victims_box); // TODO: Fix others
  // var other_victims_box = req.body.other_victims_box;
  // if (other_victims_box) {
  //   victim_type = victim_type + "," + other_victims_box;
  //   victim_type = victim_type.replace("otherVictims,", "");
  // }
  victim_type = victim_type.replace("otherVictims,", "");
  var method = req.body.howAreTheyTrafficked; //always
  var bigNeed = req.body.biggestNeed; //always
  var timeStamp = req.body.timeStamp; //always
  var lat = req.body.latitude;
  var long = req.body.longitude;
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
    biggest_need: bigNeed,
    latitude: lat,
    longitude: long
  };

  function otherVictimsHelper(other) {
    if (other) {
      return ",Other: " + other;
    } else {
      return "";
    }
  }

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

function foo(arr) {
  var a = [],
    b = [],
    prev;

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
}

router.get("/api/workshopTypeGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.workshop_type) {
        workshopTypes.push(form.workshop_type);
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/targetGroupGraph", function(req, res) {
  var arr = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.targetgroup) {
        arr.push(form.targetgroup);
      }
    });
    arr = [].concat.apply([], arr);
    arr = foo(arr);
    res.json({ types: arr[0], occurences: arr[1] });
  });
});

router.get("/api/ageGroupGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.agegroup) {
        workshopTypes.push(form.agegroup);
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/typesExploitGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      var temp = form.types_exploitation;
      if (temp) {
        if (temp.indexOf(",") === -1) {
          workshopTypes.push(temp);
        } else {
          temp = temp.split(",");
          temp.forEach(function(item) {
            workshopTypes.push(item);
          });
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/kenyaTraffickerGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      var temp = form.trafficking_type;
      if (temp) {
        if (temp.indexOf("Kenyan") !== -1) {
          if (temp.indexOf(",") === -1) {
            workshopTypes.push(temp);
          } else {
            temp = temp.split(",");
            temp.forEach(function(item) {
              if (item != "Kenyan") {
                workshopTypes.push(item);
              }
            });
          }
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/forTraffickerGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      var temp = form.trafficking_type;
      if (temp) {
        if (temp.indexOf("Foreigners") !== -1) {
          if (temp.indexOf(",") === -1) {
            workshopTypes.push(temp);
          } else {
            temp = temp.split(",");
            temp.forEach(function(item) {
              if (item != "Foreigners") {
                workshopTypes.push(item);
              }
            });
          }
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});
router.get("/api/victimsTraffickedGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      var temp = form.traffick_method;
      if (temp) {
        if (temp.indexOf(",") === -1) {
          workshopTypes.push(temp);
        } else {
          temp = temp.split(",");
          temp.forEach(function(item) {
            workshopTypes.push(item);
          });
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/biggestNeedGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      var temp = form.biggest_need;
      if (temp) {
        if (temp.indexOf(",") === -1) {
          workshopTypes.push(temp);
        } else {
          temp = temp.split(",");
          temp.forEach(function(item) {
            workshopTypes.push(item);
          });
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/genderPieChart", function(req, res) {
  var male = 0;
  var female = 0;
  var other = 0;
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.male_participants && !isNaN(form.male_participants)) {
        male = male + parseInt(form.male_participants);
      }
      if (form.female_participants && !isNaN(form.female_participants)) {
        female = female + parseInt(form.female_participants);
      }
      if (form.other_participants && !isNaN(form.other_participants)) {
        other = other + parseInt(form.other_participants);
      }
    });
    res.json({
      types: ["Male", "Female", "Others"],
      occurences: [male, female, other]
    });
  });
});

router.get("/api/typesTraffickingChart", function(req, res) {
  var internal = 0;
  var cross = 0;
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.types_trafficking) {
        var temp = form.types_trafficking;
        temp = temp.split(",");
        if (temp.length == 1) {
          if (temp[0] == "Internal") {
            internal = internal + 1;
          } else {
            cross = cross + 1;
          }
        } else {
          internal = internal + 1;
          cross = cross + 1;
        }
      }
    });
    res.json({
      types: ["Internal", "Cross-Border"],
      occurences: [internal, cross]
    });
  });
});

router.get("/api/sourceDestinationGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.source || form.destination) {
        if (form.source) {
          workshopTypes.push(form.source);
        }
        if (form.destination) {
          workshopTypes.push(form.destination);
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/victimGenderGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.victim_type) {
        console.log(form.victim_type);
        if (form.victim_type.includes("Male")) {
          workshopTypes.push("Male");
        }
        if (form.victim_type.includes("Female")) {
          workshopTypes.push("Female");
        }
        if (form.victim_type.includes("Other")) {
          workshopTypes.push("Other");
        }
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/victimCategoryGraph", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (form.victim_type) {
        var temp = form.victim_type;
        temp = temp.replace("Male,", "");
        temp = temp.replace("Female,", "");
        temp = temp.split(",");
        temp.forEach(function(item) {
          workshopTypes.push(item);
        });
      }
    });
    workshopTypes = foo(workshopTypes);
    res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
  });
});

router.get("/api/workshopMap", function(req, res) {
  var workshopTypes = [];
  formSchema.find({}, function(err, forms) {
    forms.forEach(function(form) {
      if (
        form.workshop_type &&
        form.latitude &&
        form.longitude &&
        form.county &&
        form.town
      ) {
        workshopTypes.push([
          form.workshop_type,
          form.latitude,
          form.longitude,
          form.county,
          form.town
        ]);
      }
    });
    res.json({ markers: workshopTypes });
  });
});

// router.get("/api/categoryVictimGraph", function(req, res) {
//   var workshopTypes = [];
//   formSchema.find({}, function(err, forms) {
//     forms.forEach(function(form) {
//       var temp = form.victim_type;
//       if (temp) {
//         // temp = temp.split(",");
//         // if(temp[0].includes("Boys") || temp[0].includes("Girls") || temp[0].includes("Adult Men") || temp[0].includes("Adult Women")
//         // || temp[0].includes("Elderly") || temp[0].includes("Refuges / Foreigners") || temp[0].includes("Orphans / Disabled Persons") || temp[0].includes("LGBTQ+")){
//         //   temp.splice(temp.indexOf("stringToRemoveFromArray"), 1);
//         // }
//
//       }
//     workshopTypes = foo(workshopTypes);
//     res.json({ types: workshopTypes[0], occurences: workshopTypes[1] });
//   });
// });

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
  if (req.body.disable) {
    accountSchema.findOneAndUpdate(
      { username: req.body.user },
      { $set: { valid: false } },
      { new: true },
      function(err, user) {
        console.log(user);
        res.redirect("/");
      }
    );
  } else {
    accountSchema.findOneAndUpdate(
      { username: req.body.user },
      { $set: { valid: true } },
      { new: true },
      function(err, user) {
        console.log(user);
        res.redirect("/");
      }
    );
  }
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
