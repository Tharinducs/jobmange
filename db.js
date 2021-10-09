'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'admin1234dwp',
    database : 'jobme'
    // host     : 'localhost',
    // user     : 'jobmelkcp',
    // password : '1J6uYz1wj1',
    // database : 'jobmelkc_jobme'
});

// var connection = mysql.createConnection({
//     host : '144.76.135.213',
//     port :"3306",
//     user:"jobmelkcp",
//     password:"1J6uYz1wj1",
//     database:"jobmelkc_jobme"
// })

connection.connect(function(err) {
    if (!err){
        console.log("Database connection succeeded...!");
    }

    else{
        console.log('Error in DB connection :'+JSON.stringify(err,undefined, 2));
    }
});

module.exports = connection;

// module.exports = {
//     "secret": "myapplicationsecret"
// };