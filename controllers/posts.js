var express = require('express');
var async = require("async");
var db = require('../models');
var router = express.Router();

// POST /posts - create a new post
router.post('/', function(req, res) {
    //Make the comma-separated list of tags into an array
    var tags = [];
    if (req.body.tags) {
        tags = req.body.tags.split(",");
    }

    //A few basic validations
    if (!req.body.title || req.body.title.trim().length < 2) {
        res.send("Error: Please include a title containing at least 3 letters.");
    }
    if (!req.body.content || req.body.content.trim().length < 5) {
        res.send("Error: Please include a valid content section.");
    }

    db.post.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.body.userId
        })
        .then(function(post) {
            if (tags.length > 0) {
                //Add those tags
                async.forEachSeries(tags, function(tag, callback) {
                    db.tag.findOrCreate({
                            where: {
                                name: tag
                            }
                        })
                        .spread(function(newTag, wasCreated) {
                            if (newTag) {
                                //Add the relationship in the third table, post_tag
                                post.addTag(newTag);
                            }
                            callback(null);
                        });
                }, function() {
                    //This runs when everything is done
                    res.redirect('/posts/' + post.id);
                }); //end of forEach
            } //end if statement
            else {
                res.redirect('/posts/' + post.id);
            }
        })
        .catch(function(error) {
            console.log("ERROR: ", error);
            res.status(400).render('site/404');
        });
});

// GET /posts/new - display form for creating new posts
router.get('/new', function(req, res) {
    db.user.findAll()
        .then(function(users) {
            res.render('posts/new', {
                users: users
            });
        })
        .catch(function(error) {
            res.status(400).render('main/404');
        });
});

// GET /posts/:id - display a specific post and its user
router.get('/:id', function(req, res) {
    db.post.find({
            where: {
                id: req.params.id
            },
            include: [db.user, db.comment, db.tag]
        })
        .then(function(post) {
            if (!post) throw Error();
            res.render('posts/show', {
                post: post
            });
        })
        .catch(function(error) {
            res.status(400).render('main/404');
        });
});

router.post('/:id/comments', function(req, res) {
    db.comment.create({
        name: req.body.name || 'Anonymous',
        content: req.body.content,
        postId: req.params.id
    }).then(function(comment) {
        res.redirect('/posts/' + req.params.id);
    });
});

module.exports = router;
