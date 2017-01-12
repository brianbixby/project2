//requires
require('dotenv').config();
var db = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('../config/ppConfig');
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
var session = require('express-session');
var flash = require('connect-flash');
var path = require('path');
var moment = require('moment');

// gets all articles
router.get("/", function(req, res) {
    db.project_two.findAll().then(function(articles) {
        console.log(articles);
        res.render("articles/all", {
            articles: articles
        });
    });
});

//get new article form
router.get("/new", function(req, res) {
    res.render('articles/new');
});

//get single article by ID
router.get("/:id", function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        res.render("articles/one", {
            article: article
        });
    });
});
// create a new article
router.post("/new", function(req, res) {
    db.project_two.create(req.body).then(function(article) {
        res.redirect("/articles");
    });
});
// delete article and redirects
router.delete("/:id", function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        article.destroy();
        console.log(req.params.id);
        res.send({
            message: 'success destroying'
        });
    });
});

//goes to edit form by id
router.get('/:id/edit', function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        res.render('articles/edit', {
            article: article
        });
    });
});
//updates by given id
router.put('/:id', function(req, res) {
    db.project_two.findById(req.params.id).then(function(article) {
        article.update(req.body);
        res.send({
            message: 'success putting'
        });
        res.redirect('articles/:id');
    });
});

module.exports = router;
