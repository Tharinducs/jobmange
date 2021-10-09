const express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");

var xoauth2 = require("xoauth2");

// let smtpTrans = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "jobme.lk99@gmail.com",
//     pass: "Chinzy@19950127",
//     clientId:
//       "819589813267-9irmiabgccv3lmko94r00k1hnp6giuk9.apps.googleusercontent.com",
//     clientSecret: "n1N5EYvVZnax_y9di6cFi463",
//     refreshToken: "1/lmESbV3tPgWYIkfPgtgPJtEL4GeGkipJMm8UgQovqM4"
//   }
// });

var transporter = nodemailer.createTransport({
  host: 'jobme.lk',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'info@jobme.lk', // your domain email address
    pass: '1J6uYz1wj1' // your password
  }
});

var User = require("../models/user");
var jwt = require("jsonwebtoken");
const secret = "jobmextuv2345";
const passport = require("passport");

const { check, validationResult } = require("express-validator/check");

router.post(
  "/register",
  [
    check("first_name")
      .exists()
      .isString()
      .isAlpha()
      .withMessage("Must be alphabetical Chars"),
    check("last_name")
      .exists()
      .isString()
      .isAlpha()
      .withMessage("Must be alphabetical Chars"),
    check("user_type")
      .exists()
      .isString(),
    check("nic")
      .exists()
      .isString()
      .isLength({ min: 10, max: 12 })
      .withMessage("Must be like 950000014V/19950000014V"),
    check("mobile_number")
      .exists()
      .isMobilePhone()
      .isLength({ min: 10, max: 10 }),
    check("email")
      .exists()
      .isEmail()
      .withMessage("should be something like user@gmail.com"),
    check("company_name")
      .optional()
      .isString(),
    check("designation")
      .optional()
      .isString(),
    check("address")
      .exists()
      .isString(),
    check("lattitude").optional(),
    check("longtitude").optional(),
    check("password")
      .exists()
      .isLength({ min: 8 })
      .withMessage("Minimum 8 length")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      User.get_user_by_username(req.body.email, (err, user_sel) => {
        if (Object.keys(user_sel).length == 0) {
          var user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            user_type: req.body.user_type,
            nic: req.body.nic,
            mobile_number: req.body.mobile_number,
            email: req.body.email,
            company_name: req.body.company_name,
            designation: req.body.designation,
            address: req.body.address,
            username: req.body.email,
            password: req.body.password,
            verified: false
          };

          User.save_user(user, (err, user) => {
            console.log(user);
            if (!err) {
              var v_code = {
                hash: req.body.mobile_number,
                user_id: user.insertId
              };

              User.create_v_code(v_code, (err, v_code) => {
                console.log("jii"+JSON.stringify(v_code))
                if (!err) {
                  User.get_last_insert_v_code(
                    v_code.insertId,
                    async (err, user, result) => {
                      console.log("iii"+JSON.stringify(user))
                      try {
                        if (user) {
                          let link = `https://jobmeback.jobme.lk/api/user/verify?id=${
                            user[0].hash
                          }`;
                          let info = await smtpTrans.sendMail({
                            from: '"Welcome!!" <jobme.lk99@gmail.com>',
                            to: req.body.email,
                            subject: "Please confirm your Email account",
                            html:
                              "Hi!,<br><br> Please Click on the link to verify your email.<br><br><center><a href=" +
                              link +
                              ">Click here to verify</a></center>.<br>Thank you for registering with jobme.lk!.<br><br> Jobme.lk Team",
                            attachments: [
                              {
                                filename: "jobme.lk.png",
                                path: "./assets/logo.png",
                                cid: "logo@jobme.lk"
                              }
                            ]
                          });

                          console.log("inside mail");
                          console.log(info)
                          if (info) {
                            res.status(200).json({
                              status: true,
                              msg: "Succesfully registered!"
                            });
                          }
                        }
                      } catch (error) {
                        res.status(500).json({ msg: error });
                      }
                    }
                  );
                }
              });
            }
          });
        } else {
          res.status(409).json({ state: false, msg: "user exsits" });
        }
      });
    }
  }
);

router.get("/verify", (req, res) => {
  const vcode = req.query.id;
  User.get_user_by_vcode(vcode, (err, user, result) => {
    if (Object.keys(user).length != 0) {
      User.verify_user(user[0].user_id, (err, user) => {
        if (err) {
          throw err;
        }

        if (user) {
          User.vcode_remove(vcode, (err, user) => {
            if (err) {
              throw err;
            }

            if (user) {
              res.redirect("https://www.facebook.com/");
            }
          });
        } else {
          res.redirect("https://www.facebook.com/");
        }
      });
    } else {
      res.redirect("https://www.facebook.com/");
    }
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.get_verified_user_by_username(username, async (err, user, result) => {
    //check wether user exists
    if (err) {
      throw err;
    }

    if (Object.keys(user).length == 0) {
      res.status(404).json({ state: false, msg: "No user found" });
    }

    if (Object.keys(user).length != 0) {
      User.passwordCheck(password, user[0].password, function(err, match) {
        //check wether password is matching or not
        if (err) {
          res
            .status(200)
            .json({ state: false, msg: "your password is incorrect" });
        }

        const user_sel = {
          user_id: user[0].user_id,
          username: user[0].username,
          type: user[0].user_type,
          nic: user[0].nic
        };
        if (match) {
          const token = jwt.sign(user_sel, secret, {
            // create jwt token for the authorized user
            expiresIn: 86400 * 3
          });
          res.json({
            state: true,
            token: token,
            user: user_sel
          });
        } else {
          res
            .status(401)
            .json({ state: false, msg: "password does not match" });
        }
      });
    }
  });
});

router.get(
  "/count/jobholders",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.get_jobholders_count((err, count) => {
      if (err) {
        throw err;
      }

      if (count) {
        res.status(200).json({ jobholderCount: count[0].jobholderCount });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get(
  "/count/jobseekers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.get_jobseekers_count((err, count) => {
      if (err) {
        throw err;
      }

      if (count) {
        res.status(200).json({ jobseekersCount: count[0].jobseekerCount });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get('/allusers',passport.authenticate("jwt", { session: false }),(req,res)=>{
  User.getAllusers((err, users, result)=>{
    if (err) {
      throw err;
    }

    if (users) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  })
})

router.get('/getalljobseekers',passport.authenticate("jwt", { session: false }),(req,res)=>{
  User.getAllJobseekers((err, users, result)=>{
    if (err) {
      throw err;
    }

    if (users) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  })
})

router.get('/getalljobseekers',passport.authenticate("jwt", { session: false }),(req,res)=>{
  User.getAllJobseekers((err, users, result)=>{
    if (err) {
      throw err;
    }

    if (users) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  })
})

router.get('/getalljobholders',passport.authenticate("jwt", { session: false }),(req,res)=>{
  User.getAllJobholders((err, users, result)=>{
    if (err) {
      throw err;
    }

    if (users) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  })
})


router.get('/exportusers',passport.authenticate("jwt", { session: false }),(req,res)=>{
  User.exportUsers((err, users, result)=>{
    if (err) {
      throw err;
    }

    if (users) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  })
})

module.exports = router;
