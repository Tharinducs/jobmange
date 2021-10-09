const express = require("express");
var router = express.Router();

var Advertisment = require("../models/advertisment");

const passport = require("passport");

const { check, validationResult } = require("express-validator/check");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,  "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 //1Mb
  },
  fileFilter: fileFilter
});

router.post("/logo", upload.single("logoImage"), (req, res, next) => {
  console.log(req.file);
  res.status(200).json({ imageSrc: req.file.path });
});

router.post(
  "/govnotices/add",
  passport.authenticate("jwt", { session: false }),
  [
    check("source")
      .exists()
      .isString(),
    check("source_type")
      .exists()
      .isString(),
    check("department")
      .exists()
      .isString(),
    check("closing_date")
      .exists()
      .isString(),
    check("publish_date")
      .exists()
      .isString()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      let govAdd;
      if (req.body.source_type == "image") {
        govAdd = {
          title: req.body.title,
          source: req.body.source,
          source_type: req.body.source_type,
          source_image_ref: req.body.source_image_ref,
          image_ref: req.body.image_ref,
          department: req.body.department,
          closing_date: req.body.closing_date,
          publish_date: req.body.publish_date,
          closed: 0
        };
      }

      if (req.body.source_type == "pdf") {
        govAdd = {
          title: req.body.title,
          source: req.body.source,
          source_type: req.body.source_type,
          source_pdf_ref: req.body.source_pdf_ref,
          image_ref: req.body.image_ref,
          department: req.body.department,
          closing_date: req.body.closing_date,
          publish_date: req.body.publish_date,
          closed: 0
        };
      }

      Advertisment.addGovernmentAdvertisment(govAdd, (err, add) => {
        if (err) {
          throw err;
        }

        if (add) {
          res.status(200).json({ msg: "sucessfully added" });
        } else {
          res.status(406).json({ msg: "something went wrong" });
        }
      });
    }
  }
);

router.get("/govnotice/:id", (req, res) => {
  const govAdId = req.params.id;
  Advertisment.get_gov_advertisments_by_id(govAdId, (err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get("/govnotices", (req, res) => {
  Advertisment.get_gov_advertisments((err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get("/govnotices/closed", (req, res) => {
  Advertisment.get_gov_closed_advertisments((err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get(
  "/count/govnotice",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Advertisment.get_gov_advertisments_count((err, count) => {
      if (err) {
        throw err;
      }

      if (count) {
        res.status(200).json({ govAdCount: count[0].govAdCount });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.post(
  "/prvnotices/add",
  passport.authenticate("jwt", { session: false }),
  [
    check("city")
      .exists()
      .isString()
      .withMessage("sould be a string"),
    check("title")
      .exists()
      .isString(),
    check("type")
      .exists()
      .isString(),
    check("industry")
      .exists()
      .isInt(),
    check("closing_date")
      .exists()
      .isString(),
    check("posting_date")
      .exists()
      .isString(),
    check("logo")
      .exists()
      .isString()
  ],
  (req, res) => {
    console.log("req data ", req.body);
    const errors = validationResult(req);
    console.log("hii");
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const manual = req.body.type;
      var privateAd = {};
      console.log(manual);
      if (manual == "manual") {
        privateAd = {
          city: req.body.city,
          title: req.body.title,
          type: req.body.type,
          job_description: req.body.job_description,
          job_type: req.body.job_type,
          industry: req.body.industry,
          role: req.body.role,
          start_sal: req.body.start_sal,
          end_sal: req.body.end_sal,
          closing_date: req.body.closing_date,
          posting_date: req.body.posting_date,
          company_name: req.body.company_name,
          user_id: req.body.user_id,
          logo: req.body.logo,
          minimum_qulifications: req.body.minimum_qulifications,
          education_specilization: req.body.education_specilization,
          skils: req.body.skils,
          max_age: req.body.max_age,
          name: req.body.name,
          email: req.body.email,
          tel_no: req.body.tel_no,
          closed: 0,
          verified: 0
        };
      } else {
        privateAd = {
          title: req.body.title,
          city: req.body.city,
          type: req.body.type,
          industry: req.body.industry,
          add_file_path: req.body.add_file_path,
          logo: req.body.logo,
          company_name: req.body.company_name,
          user_id: req.body.user_id,
          closing_date: req.body.closing_date,
          posting_date: req.body.posting_date,
          closed: 0,
          verified: 0
        };
      }

      Advertisment.addPrivateAdvertisment(privateAd, (err, add) => {
        if (err) {
          throw err;
        }

        if (add) {
          res.status(200).json({ msg: "sucessfully added" });
        } else {
          res.status(406).json({ msg: "something went wrong" });
        }
      });
    }
  }
);

router.get("/prvnotice/:id", (req, res) => {
  const govAdId = req.params.id;
  Advertisment.get_prv_advertisments_by_id(govAdId, (err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get("/prvnotices", (req, res) => {
  Advertisment.get_prv_advertisments((err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get("/prvnotices/closed", (req, res) => {
  Advertisment.get_prv_closed_advertisments((err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.post(
  "/verify/prvnotice/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    const prvAdId = req.params.id;
    Advertisment.verify_prv_advertisment(prvAdId, (err, add) => {
      if (err) {
        throw err;
      }

      if (add) {
        console.log(add);
        Advertisment.get_prv_advertisments_by_id(
          prvAdId,
          (err, adds, result) => {
            if (err) {
              throw err;
            }  

            if (adds) {
              console.log(adds[0].industry);
              Advertisment.up_category_count(adds[0].industry, (err, count) => {
                if (err) {
                  throw err;
                }

                if (count) {
                  res.status(200).json({ msg: "Successfully Updated" });
                } else {
                  res.status(406).json({ msg: "something went wrong" });
                }
              });
            } else {
              res.status(404).json({ msg: "Something went wrong" });
            }
          }
        );
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.post("/delete/prvnotice/:id", (req, res) => {
  console.log(req);
  const prvAdId = req.params.id;
  Advertisment.delete_prv(prvAdId, (err, add) => {
    if (err) {
      throw err;
    }

    if (add) {
      res.status(200).json({ msg: "Successfully Updated" });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get("/category/prvnotices/:id", (req, res) => {
  const categoryId = req.params.id;
  Advertisment.get_prv_notices_by_category(categoryId, (err, adds, result) => {
    if (err) {
      throw err;
    }

    if (adds) {
      res.status(200).json({ advertisments: adds });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get(
  "/notv/prvnotices",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Advertisment.get_not_verified_prv_advertisments((err, adds, result) => {
      if (err) {
        throw err;
      }

      if (adds) {
        res.status(200).json({ advertisments: adds });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get(
  "/count/prvnotices",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Advertisment.get_prv_advertisments_count((err, count) => {
      if (err) {
        throw err;
      }

      if (count) {
        res.status(200).json({ prvAdCount: count[0].prvAdCount });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get("/categories/prvnotices", (req, res) => {
  Advertisment.get_category_list((err, categories, result) => {
    if (err) {
      throw err;
    }

    if (categories) {
      res.status(200).json({ categories: categories });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.post(
  "/categories/add/prvnotices",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const category = {
      category: req.body.category,
      description: req.body.description
    };

    Advertisment.addCategory(category, (err, cat) => {
      if (err) {
        throw err;
      }

      if (cat) {
        res.status(200).json({ msg: "Successfully Added" });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

module.exports = router;
