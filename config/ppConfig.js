var FacebookStrategy = require('passport-facebook').Strategy;
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

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, callback) {
// this function is called to authenticate
    db.user.find({
        where: {
            email: email
        }
    }).then(function(user) {
        if (!user || !user.validPassword(password)) {
            callback(null, false);
        } else {
            callback(null, user);
        }
    }).catch(callback);
}));

// setup passport to use the FacebookStrategy
// pass app id, app secret, and callback URL from dotenv
// define the fields we're getting from Facebook, and enabling proof
// tells Facebook to check the client secret in order to verify our server
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/facebook/callback',
  profileFields: ['id', 'email', 'displayName'],
  enableProof: true
}, function(accessToken, refreshToken, profile, cb) {
//  This function is called when a user is authenticated
//  We can access our token and profile, as well as run a callback
//  function that accepts an error and a user

// pull the email from the user's Facebook profile, if it exists
var email = profile.emails ? profile.emails[0].value : null;
// see if the user exists in the database by email
db.user.find({
   where: { email: email },
 }).then(function(existingUser) {
// if the user with a valid email exists already, link their existing account with their Facebook.
if (existingUser && email) {
    existingUser.update({
      facebookId: profile.id,
      facebookToken: accessToken
    }).then(function(updatedUser) {
      cb(null, existingUser);
    }).catch(cb);
  } else {
// if the user doesn't exist, findOrCreate the user on the user's Facebook id
db.user.findOrCreate({
where: { facebookId: profile.id },
defaults: {
 facebookToken: accessToken,
 name: profile.displayName,
 email: email
}
}).spread(function(user, created) {
// if the user is created, we're done
if (created) {
      return cb(null, user);
    } else {
// if the user wasn't created, they already exist so Update their access token
user.facebookToken = accessToken;
user.save().then(function() {
 cb(null, user);
}).catch(cb);
}
}).catch(cb);
}
}).catch(cb);
}));

module.exports = passport;
