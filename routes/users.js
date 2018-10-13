var express = require("express");
var router = express.Router();

//Probably don't need this file, don't worry about this for now.

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
