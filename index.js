const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
var schedule = require("node-schedule");
var Advertisment = require("./models/advertisment");

const path = require("path");

var app = express();
app.use(cors());
app.use(helmet());
const config = require("./db.js");
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads/", express.static("uploads"));

const router = express.Router();

var user_controller = require("./controllers/user_controller");
var advertisment_controller = require("./controllers/advertisment_controller");
var feedback_controller = require("./controllers/feedback_controller");
var contact_us = require("./controllers/contactus_controller");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, function() {
  console.log("Server started at port : 3000");
});

var j = schedule.scheduleJob({ hour: 14, minute: 53 }, function() {
  Advertisment.get_prv_advertisments((err, advertisments, result) => {
    advertisments.forEach(element => {
      const date = new Date(element.closing_date);
      const organizedDate =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      const today = new Date();
      const organizedToday =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
     if(organizedDate === organizedToday){
       Advertisment.closePrvAd(element.id)
     }
    });
  });

  Advertisment.get_gov_advertisments((err,advertisments,result)=>{
    advertisments.forEach(element => {
      const date = new Date(element.closing_date);
      
      const organizedDate =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()+1);
        console.log(organizedDate);
      const today = new Date();
      const organizedToday =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
     if(organizedDate === organizedToday){
       Advertisment.closeGovAd(element.id)
     }
    });
  })
});

app.use("/api/user", user_controller);
app.use("/api/notice", advertisment_controller);
app.use("/api/feedback", feedback_controller);
app.use("/api/contact", contact_us);
