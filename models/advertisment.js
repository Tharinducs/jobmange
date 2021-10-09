var sql = require("../db.js");

module.exports.addGovernmentAdvertisment = (govAdd, callback) => {
  sql.query("INSERT INTO government_advertisments set ?", govAdd, callback);
};

module.exports.get_gov_advertisments = callback => {
  sql.query(
    "SELECT * FROM government_advertisments WHERE closed = 0",
    callback
  );
};

module.exports.get_gov_advertisments_by_id = (govAdId, callback) => {
  sql.query(
    "SELECT * FROM government_advertisments WHERE gov_ad_id = '" +
      govAdId +
      "'",
    callback
  );
};

module.exports.get_gov_closed_advertisments = callback => {
  sql.query(
    "SELECT * FROM government_advertisments WHERE closed = 1",
    callback
  );
};

module.exports.addPrivateAdvertisment = function(prvtAdd, callback) {
  sql.query("INSERT INTO private_advertisements set ?", prvtAdd, callback);
};

module.exports.get_prv_advertisments = callback => {
  sql.query(
    "SELECT * FROM private_advertisements WHERE closed = 0 AND verified = 1",
    callback
  );
};

module.exports.delete_prv=(prvAdId, callback) =>{
  sql.query(
    "DE"
  )
}

module.exports.closePrvAd=(prvAdId) =>{
  sql.query(
    "UPDATE private_advertisements SET closed = 1 WHERE id='" + prvAdId + "'"
  )
}

module.exports.closeGovAd=(govAdId) =>{
  sql.query(
    "UPDATE government_advertisments SET closed = 1 WHERE gov_ad_id='" + govAdId + "'"
  )
}

module.exports.get_prv_advertisments_by_id = (prvAdId, callback) => {
  sql.query(
    "SELECT * FROM private_advertisements WHERE id = '" + prvAdId + "'",
    callback
  );
};

module.exports.get_prv_closed_advertisments = callback => {
  sql.query("SELECT * FROM private_advertisements WHERE closed = 1", callback);
};

module.exports.verify_prv_advertisment = (prvAdId, callback) => {
  sql.query(
    "UPDATE private_advertisements SET verified = 1 WHERE id='" + prvAdId + "'",
    callback
  );
};

module.exports.get_not_verified_prv_advertisments = callback => {
  sql.query(
    "SELECT * FROM private_advertisements WHERE verified = 0",
    callback
  );
};

module.exports.get_prv_advertisments_count = callback => {
  sql.query(
    "SELECT COUNT(*) AS prvAdCount FROM private_advertisements WHERE verified = 1",
    callback
  );
};

module.exports.get_gov_advertisments_count = callback => {
  sql.query(
    "SELECT COUNT(*) AS govAdCount FROM government_advertisments",
    callback
  );
};

module.exports.get_category_list = callback => {
  sql.query("SELECT * FROM private_categories", callback);
};

module.exports.up_category_count = (industry, callback) => {
  sql.query(
    "UPDATE private_categories SET count = count+1 WHERE category_id='" +
      industry +
      "'",
    callback
  );
};

module.exports.get_prv_notices_by_category = (industry, callback) => {
  sql.query(
    "SELECT * FROM private_advertisements WHERE industry = '" +
      industry +
      "' AND verified = 1 AND closed = 0",
    callback
  );
};

module.exports.addCategory = (category, callback) => {
  sql.query("INSERT INTO private_categories set ?", category, callback);
};
