var express = require('express');
var router = express.Router();
var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var moment = require('moment');
var async = require("async");

// get all
router.get('/all', isLoggedIn, function(req, res) {
    req.user.getFavorites().then(function(favorites) {
        res.render('favorites/all', {
            favorites: favorites
        });
    });
});
// get by id
router.get('/:id', isLoggedIn, function(req, res) {
    db.user.findById(req.user.id).then(function(user) {
        db.favorite.findById(req.params.id).then(function(favorite) {
            res.render('favorites/one', {
                favorite: favorite
            });
        });
    });
});
// POST
router.post('/:id', isLoggedIn, function(req, res) {
    req.user.createFavorite({
        indicatorcode: req.params.id,
        userId: req.user.id,
    }).then(function(favorite) {
        console.log("CREATED FAV", favorite);
        res.send(true);
    });
});
//DELETE BY ID
router.delete("/:id", function(req, res) {
    db.user.findById(req.user.id).then(function(user) {
        db.favorite.findById(req.params.id).then(function(favorite) {
            favorite.destroy();
            console.log(req.params.id);
            res.send({
                message: 'success destroying'
            });
        });
    });
});
// DELETE BY ALL
router.delete("/all", function(req, res) {
    db.user.findById(req.user.id).then(function(user) {
        db.favorite.findById(req.params.id).then(function(favorite) {
            favorite.destroy();
            console.log(req.params.id);
            res.send({
                message: 'success destroying'
            });
        });
    });
});

module.exports = router;
