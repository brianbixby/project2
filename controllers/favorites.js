var express = require('express');
var router = express.Router();
var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');

// GET -
router.get('/all', isLoggedIn, function(req, res) {
    req.user.getFavorites().then(function(favorites) {
        res.render('favorites/all', {
            favorites: favorites
        });
    });
});

// POST -
router.post('/all', isLoggedIn, function(req, res) {
    req.user.createFavorite().then(function(favorite) {
        db.favorite.create({
            indicatorcode: req.params.id,
            userId: req.user.id,
        });
    });
});

module.exports = router;
