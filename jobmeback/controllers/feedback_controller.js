const express = require("express");
var router = express.Router();

const passport = require("passport");

var Feedback = require("../models/feedback");

router.post(
  "/add/feedback",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const feedback = {
      feedback: req.body.feedback,
      user_id: req.body.user_id,
      deleted: 0
    };
    Feedback.add_feedback(feedback, (err, feedback) => {
      if (err) {
        throw err;
      }

      if (feedback) {
        res.status(200).json({ msg: "Successfully Added" });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get(
  "/all/feedbacks",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Feedback.get_all_feedbacks((err, feedbacks, result) => {
      if (err) {
        throw err;
      }

      if (feedbacks) {
        res.status(200).json({ feedbacks: feedbacks });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get("/feedbacks", (req, res) => {
  Feedback.get_feedbacks((err, feedbacks, result) => {
    if (err) {
      throw err;
    }

    if (feedbacks) {
      res.status(200).json({ feedbacks: feedbacks });
    } else {
      res.status(404).json({ msg: "Something went wrong" });
    }
  });
});

router.get(
  "/feedbacks/deleted",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Feedback.get_deleted_feedbacks((err, feedbacks, result) => {
      if (err) {
        throw err;
      }

      if (feedbacks) {
        res.status(200).json({ feedbacks: feedbacks });
      } else {
        res.status(404).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.post(
  "/feedback/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const feedbackId = req.params.id;
    Feedback.delete_feedback(feedbackId, (err, feedback) => {
      if (err) {
        throw err;
      }

      if (feedback) {
        res.status(200).json({ msg: "Succesfully deleted" });
      } else {
        res.status(406).json({ msg: "Something went wrong" });
      }
    });
  }
);

router.get(
  "/feedbacks/count",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Feedback.get_feedback_count((err, count) => {
      if (err) {
        throw err;
      }

      if (count) {
        res.status(200).json({ feedbackCount: count[0].feedbackCount });
      } else {
        res.status(406).json({ msg: "Something went wrong!" });
      }
    });
  }
);

router.get("/feedbacks/allrecent", (req, res) => {
  Feedback.get_recent_feedbacks((err, feedbacks, result) => {
    if (err) {
      throw err;
    }

    if (feedbacks) {
      res.status(200).json({ feedbacks: feedbacks });
    } else {
      res.status(406).json({ msg: "Something went wrong!" });
    }
  });
});

module.exports = router;
