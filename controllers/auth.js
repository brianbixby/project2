var db = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('../config/ppConfig');

router.get('/signup', function(req, res) {
    res.render('./auth/signup');
});

router.post('/signup', function(req, res) {
    // find or create = if it doesn tfind it create it
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        // defaults account for other values not listed above like password and name
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
        // spread is the promise for the db call, was user object created
    }).spread(function(user, created) {
        if (created) {
            // once you create a account it auto logs you in
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'account created and logged in'
            })(req, res); // req and res here get passed into passport.authenticate function it's in
            // console.log('User created');
            // res.redirect('/');
        } else {
            // console.log('email already exists');
            req.flash('error', 'email already exists');
            res.redirect('/auth/signup');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        // console.log('an error occurred', error.message);
        res.redirect('/auth/signup');
    });
    // res.send(req.body);
    // json data shows on page with res.send email name and password
});
router.get('/login', function(req, res) {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'logged in',
    failureFlash: 'invalid username or password'
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'logged out');
    res.redirect('/');
});

module.exports = router;
