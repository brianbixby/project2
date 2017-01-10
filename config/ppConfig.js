var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

// serialize is like stringify makes complex data structure easier to store
passport.serializeUser(function(user, callback) {
    callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
    db.user.findById(id).then(function(user) {
        callback(null, user);
    }).catch(callback);
});

// now we build out Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, callback) {
    // this function get called when we want to authenticate
    db.user.find({
        where: {
            email: email
        }
    }).then(function(user) {
        if (!user || !user.validPassword(password)) {
            // valid password is called from
            callback(null, false);
        } else {
            callback(null, user);
        }
    }).catch(callback);
}));

module.exports = passport;
