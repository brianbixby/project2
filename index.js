//requires
var express = require("express");
var request = require('request');
var bodyParser = require("body-parser");
var ejsLayouts = require("express-ejs-layouts");
var path = require('path');
var moment = require('moment');

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
//routes
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
    var key = 'YLSxgabiaDdCAQPtRwAN';
    var baseUrl = 'https://www.quandl.com/api/v3/datasets/FRED/A2007C1A027NBEA.json?api_key';

    // var query = '';

    // allow people to search using query parameters.
    // if (req.query.q !== undefined) {
    //     query = req.query.q;
    // }

    // attach the query to the url.
    // var url = baseUrl + '?s=' + query;

    var url = baseUrl + key;
    request(url, function(error, response, body) {
        // if (!error && response.statusCode == 200) {
        var result = JSON.parse(body).body;
        console.log('body: ', body);
        res.render('site/index', {
            body: body
        });
        // }
    });
});
// gets all articles
app.get("/articles", function(req, res) {
    db.project_two.findAll().then(function(articles) {
        console.log(articles);
        res.render("articles/all", {
            articles: articles
        });
    });
});

//get new article form
app.get("/articles/new", function(req, res) {
    res.render('articles/new');
});

//get single article by ID
app.get("/articles/:id", function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        res.render("articles/one", {
            article: article
        });
    });
});
// create a new article
app.post("/articles/new", function(req, res) {
    db.project_two.create(req.body).then(function(article) {
        res.redirect("/articles");
    });
});
// delete beers and redirects to beers
app.delete("/articles/:id", function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        article.destroy();
        console.log(req.params.id);
        res.send({
            message: 'success destroying'
        });
    });
});

//goes to edit form for beer with id
app.get('/articles/:id/edit', function(req, res) {
    // res.send("edit form by id works");
    db.project_two.findById(req.params.id).then(function(article) {
        res.render('articles/edit', {
            article: article
        });
    });
});
//updates beer with given id
app.put('/articles/:id', function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        article.update(req.body);
        res.send({
            message: 'success putting'
        });
        res.redirect('/articles/:id');
    });
});
//listen
var server = app.listen(process.env.PORT || 3000);
module.exports = server;
