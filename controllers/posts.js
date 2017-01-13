var express = require('express');
var async = require("async");
var db = require('../models');
var router = express.Router();

router.get("/", function(req, res) {
    db.post.findAll({
        include: [db.user]
    }).then(function(posts) {
        res.render('posts/all', {
            posts: posts
        });
    });
});

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

router.post("/new", function(req, res) {
    var tags = [];
    if (req.body.tags) {
        tags = req.body.tags.split(",");
    }
    console.log("tags array", tags);

    if (!req.body.title || req.body.title.trim().length < 2) {
        res.send("Error: Please include a title containing at least 3 charachters");
    }
    // trim.length accounts for spaces
    if (!req.body.content || req.body.content.trim().length < 5) {
        res.send("Error: Please include a valid content section");
    }
    db.post.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.body.userId,
            tag: req.body.tags
        })
        .then(function(post) {
            if (tags.length > 0) {
                // add those tags
                // tags might not get loaded so we do a second load
                tags.forEach(function(tag) {
                    db.tag.findOrCreate({
                            where: {
                                name: tag
                            }
                        })
                        .spread(function(newTag, wasCreated) {
                            if (newTag) {
                                post.addTag(newTag);
                            }
                        });
                }); //end of for each
                res.redirect('/posts/' + post.id);
            } else {
                res.redirect('/posts/' + post.id);
            }
        })
        .catch(function(error) {
            res.status(400).render('site/404');
        });
});

//
router.get('/:id', function(req, res) {
    // db.post.findAll({
    //     include: [db.user]
    // }).then(function(posts)
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
            res.status(400).render('site/404');
        });
});
//
router.post('/:id/comments', function(req, res) {
    db.comment.create({
        content: req.body.content,
        postId: req.params.id,
        // userId: req.body.userId || 'Anonymous'
    }).then(function(comment) {
        res.redirect('/posts/' + req.params.id);
    });
});
//
//
// // delete post and redirects
router.delete("/:id", function(req, res) {
    db.post.findById(req.params.id).then(function(post) {
        post.destroy();
        console.log(req.params.id);
        res.send({
            message: 'success destroying'
        });
    });
    res.redirect('/posts');
});
//
// //goes to edit form by id
router.get('/:id/edit', function(req, res) {
    db.post.findById(req.params.id).then(function(post) {
        res.render('posts/edit', {
            post: post
        });
    });
});
// //updates by given id
router.put('/:id', function(req, res) {
    db.post.findById(req.params.id).then(function(post) {
        post.update(req.body);
        res.send({
            message: 'success putting'
        });
        res.redirect('posts/:id');
    });
});

module.exports = router;
