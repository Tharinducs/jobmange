var sql = require("../db.js");

module.exports.add_contact=(contact,callback) =>{
    sql.query("INSERT INTO contact_us set ?", contact, callback);
}