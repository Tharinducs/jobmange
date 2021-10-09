var bcrypt = require("bcryptjs");
var sql = require("../db.js");

module.exports.save_user = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      if (err) {
        throw err;
      } else {
        console.log(user.password);

        sql.query("INSERT INTO users set ?", user, callback);
      }
    });
  });
};

module.exports.create_v_code = (v_code, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(v_code.hash, salt, (err, hash) => {
      v_code.hash = hash;
      if (err) {
        throw err;
      } else {
        console.log(v_code.hash);

        sql.query("INSERT INTO verification_codes set ?", v_code, callback);
      }
    });
  });
};

module.exports.get_last_insert_v_code = (v_code_insertId, callback) => {
  sql.query(
    `SELECT * FROM verification_codes WHERE 	v_code_id = ${v_code_insertId}`,
    callback
  );
};

module.exports.get_user_by_username = (username, callback) => {
  sql.query("SELECT * FROM users WHERE username='" + username + "'", callback);
};

module.exports.get_verified_user_by_username = (username, callback) => {
  sql.query(
    "SELECT * FROM users WHERE username='" + username + "' AND verified = 1",
    callback
  );
};

//
module.exports.passwordCheck = (plainpassword, hash, callback) => {
  bcrypt.compare(plainpassword, hash, (err, res) => {
    if (err) {
      throw err;
    } else {
      callback(null, res);
    }
  });
};

module.exports.findUserbyId = (id, callback) => {
  console.log(id._id)
  sql.query(
    "SELECT * FROM users WHERE user_id ='" + id._id + "' AND verified = 1",
    callback
  );
};

module.exports.findverifiedUser = (nic, callback) => {
  sql.query(
    "SELECT * FROM users WHERE nic ='" + nic + "' AND verified = 1",
    callback
  );
};

module.exports.get_user_by_vcode = (vcode, callback) => {
  sql.query(
    "SELECT * FROM verification_codes WHERE hash='" + vcode + "'",
    callback
  );
};

module.exports.verify_user = (userId, callback) => {
  console.log(userId);
  sql.query(
    "UPDATE users SET verified = 1 WHERE user_id='" + userId + "'",
    callback
  );
};

module.exports.vcode_remove = (vcode, callback) => {
  sql.query(
    "DELETE FROM verification_codes WHERE hash='" + vcode + "'",
    callback
  );
};

module.exports.get_jobholders_count = callback => {
  sql.query(
    "SELECT COUNT(*) AS jobholderCount FROM users WHERE user_type='Job Holder'",
    callback
  );
};

module.exports.get_jobholders_count = callback => {
  sql.query(
    "SELECT COUNT(*) AS jobholderCount FROM users WHERE user_type='Job Holder'",
    callback
  );
};

module.exports.get_jobseekers_count = callback => {
  sql.query(
    "SELECT COUNT(*) AS jobseekerCount FROM users WHERE user_type='Job Seeker'",
    callback
  );
};

module.exports.getAllusers = callback =>{
  sql.query(
    "SELECT * FROM users",callback
  )
}

module.exports.exportUsers = callback =>{
  sql.query(
    "SELECT first_name,last_name,nic,mobile_number,email FROM users",callback
  )
}

module.exports.getAllJobseekers = callback =>{
  sql.query(
    "SELECT * FROM users WHERE user_type='Job Seeker'",callback
  )
}

module.exports.getAllJobholders = callback =>{
  sql.query(
    "SELECT * FROM users WHERE user_type='Job Holder'",callback
  )
}
