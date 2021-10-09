var sql = require("../db.js");

module.exports.add_feedback = (feedback, callback) => {
  sql.query("INSERT INTO feedback set ?", feedback, callback);
};

module.exports.get_feedbacks = callback => {
  sql.query("SELECT * FROM feedback WHERE deleted = 0", callback);
};

module.exports.get_deleted_feedbacks = callback => {
  sql.query("SELECT * FROM feedback WHERE deleted = 1", callback);
};

module.exports.delete_feedback = (feedbackId, callback) => {
  sql.query(
    "UPDATE feedback SET deleted = 1 WHERE id='" + feedbackId + "'",
    callback
  );
};

module.exports.get_feedback_count = callback => {
  sql.query(
    "SELECT COUNT(*) AS feedbackCount FROM feedback WHERE deleted = 0",
    callback
  );
};

module.exports.get_recent_feedbacks = callback => {
  sql.query(
    "SELECT feedback.id,feedback.feedback,feedback.deleted,users.first_name,users.last_name,users.company_name,users.designation FROM feedback LEFT JOIN users ON feedback.user_id = users.user_id WHERE feedback.deleted = 0 ORDER BY feedback.id DESC LIMIT 3",
    callback
  );
};

module.exports.get_all_feedbacks = callback => {
  sql.query("SELECT * FROM feedback", callback);
};
