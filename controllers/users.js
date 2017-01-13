var express = require('express');
var db = require('../models');
var router = express.Router();

// GET /users - display all users
router.get('/', function(req, res) {
    db.user.findAll()
        .then(function(users) {
            res.render('users/index', {
                users: users
            });
        })
        .catch(function(error) {
            res.status(400).render('main/404');
        });
});

// POST /users - create a new user
router.post('/', function(req, res) {
    db.user.create({
            name: req.body.name
        })
        .then(function(user) {
            res.redirect('/users');
        })
        .catch(function(error) {
            res.status(400).render('main/404');
        });
});

// GET /users/new - display form for creating a new user
router.get('/new', function(req, res) {
    db.user.findAll()
        .then(function(users) {
            res.render('users/new', {
                users: users
            });
        });
});

// GET /users/:id - display a specific user and their posts
router.get('/:id', function(req, res) {
    db.user.find({
            where: {
                id: req.params.id
            },
            include: [db.post]
        })
        .then(function(user) {
            if (!user) throw Error();
            res.render('users/show', {
                user: user
            });
        })
        .catch(function(error) {
            res.status(400).render('main/404');
        });
});

module.exports = router;
