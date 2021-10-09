const express = require("express");
var router = express.Router();

const passport = require("passport");

var Contactus = require("../models/contactus");

router.post("/add/contactus", (req, res) => {
  const contact = {
    email: req.body.email,
    mobile_no: req.body.mobile_no,
    message: req.body.message
  };
  Contactus.add_contact(contact, (err, contact) => {
    if (err) {
      throw err;
    }

    if (contact) {
      res.status(200).json({ msg: "Successfully Added" });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

module.exports = router;
