var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
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
  fname: String,
  lname: String,
  town: String,
  county: String,
  targetgroup: [String],
  agegroup: String,
  female_participants: String, //number of female participants
  // fchild: Number, //number of female children
  male_participants: String, // number of male participants
  other_participants: String,
  total_participants: String,
  types_exploitation: String, // Types of exploitation
  types_trafficking: String,
  source: String, // Is this the area where you are primarily source or destination
  destination: String,
  sourceExplanation: String,
  destinationExplantion: String,
  trafficking_type: String, // Trafficker type
  // source-destination: Number,
  // destination: Number,
  // source: Number,
  // foreign: Number, //0 for Kenyan, 1 for Foreigner
  victim_type: String,
  // victim-gender: Number, //male,female, both
  // victim-adult: Number, //0 for child, 1 for adult
  // victim-wealth : Number, //0 for poor, 1 for neither, 2 for rich
  // victim-refugee : Boolean,
  // victim-orphans: Boolean,
  // victim-disabled: Boolean,
  // victim-lgbtq: Boolean,
  traffick_method: String, //0 for Deception, 1 for coercion/force, 2 for abduction, 3 for abuse of power
  timeStamp: Date,
  biggest_need: String // 0:lack of awareness, 1:corruption, 2:lack of services for victims, 3:shame/stigmatization  lastName: String
  //Change these around and add more fields that you may need for an account here!!
});

//If you need another mongo collection, simply make another file like this in the models folder!

// Account.plugin(passportLocalMongoose);

module.exports = mongoose.model("formschema", formschema);
