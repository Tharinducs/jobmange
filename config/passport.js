const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "jobmextuv2345" ;

module.exports = function (passport) {

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("hii")
        console.log(jwt_payload.user_id)

        User.findUserbyId({_id: jwt_payload.user_id}, function(err, user) {
            if (err) {
                console.log(err);
                return done(err, false);
            }
            if (user) {
                console.log(user)
                done(null, user);
            } else {
                done(null, false);

            }
        });
    }))
}