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
var api = require('./modules/apiManipulation');

//global variables
var app = express();
var db = require("./models");
//set /use statements
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'static')));
app.use(require('morgan')('dev'));
/* middleware that allows us to access the 'moment' library
 * in every single EJS view, without having to define it
 */
app.use(function(req, res, next) {
    res.locals.moment = moment;
    next();
});
// ONLY EXISTS ON CLIENT, secret makes essions unique
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
    // this gets passed into app.get beneath
    res.locals.currentUser = req.user;
    // allows us to pass info about user into views
    next();
});

//routes
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('partials/profile');
    // res.send('it works');
});
//about
app.get('/about', function(req, res) {
    res.render('site/about');
});
//contact
app.get('/contact', function(req, res) {
    res.render('site/contact');
});

//Homepage
app.get('/', function(req, res) {
    // var key = 'YLSxgabiaDdCAQPtRwAN';
    // var baseUrl = 'https://www.quandl.com/api/v3/datasets/ZILL/C03177_A.json?api_key=YLSxgabiaDdCAQPtRwAN';
    // var url = baseUrl + key;
    var url = 'https://www.quandl.com/api/v3/datasets/ZILL/C03177_A.json?api_key=YLSxgabiaDdCAQPtRwAN';

    request(url, function(error, response, main) {
        var parsedMain = JSON.parse(main);
        if (!error && response.statusCode == 200) {
            console.log('main: ', main);
            console.log('object.dataset.column_names: ', parsedMain.dataset.column_names);
            api.parseJson(parsedMain);
            res.render("site/index", {
                parsedMain: parsedMain
            });
        }
    });
});

app.use('/articles', require('./controllers/articles'));
app.use('/auth', require('./controllers/auth'));

//listen
var server = app.listen(process.env.PORT || 3000);
module.exports = server;
