//requires
require('dotenv').config();
var express = require("express");
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
var session = require('express-session');
var request = require('request');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var path = require('path');
var moment = require('moment');
var async = require("async");
var api = require('./modules/apiManipulation');

//global variables
var app = express();
var db = require("./models");

//set & use statements
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'static')));
app.use(require('morgan')('dev'));

// middleware that allows us to access the 'moment' library in every single EJS view, without having to define it
app.use(function(req, res, next) {
  res.locals.moment = moment;
  next();
});
// ONLY EXISTS ON CLIENT, secret makes sessions unique
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretpassword',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

//Profile
app.get('/profile', isLoggedIn, function(req, res) {
  res.render('partials/profile');
});

//Homepage
app.get('/', function(req, res) {
  res.render("site/index", {
    parsedMain: null
  });
});

app.post('/api/results', function(req, res) {
  // second api key if I go over limit: var key = 'F-CKwt8F1e2GmwanRSQv';
  // structure of api url: ZILL/{AREA_CATEGORY}{AREA_CODE}_{INDICATOR_CODE}
  var baseUrl = 'https://www.quandl.com/api/v3/datasets/ZILL/';
  var areaCategory = 'S';
  var areaCode = '00013';
  var indicatorCode = req.body.indicatorCode || 'FR';
  var key = 'YLSxgabiaDdCAQPtRwAN';
  var url = baseUrl + areaCategory + areaCode + '_' + indicatorCode + '.json?api_key=' + key;
  request(url, function(error, response, main) {
    var parsedMain = JSON.parse(main);
    if (!error && response.statusCode == 200) {
      api.parseJson(parsedMain);
      res.send({
        parsedMain: parsedMain
      });
    }
  });
});

app.use('/auth', require('./controllers/auth'));
app.use('/favorites', require('./controllers/favorites'));

//listen
var server = app.listen(process.env.PORT || 3000);
module.exports = server;
