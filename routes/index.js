var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var PostSchema = require('../models/Posts.js');
var Post = mongoose.model('Post');

var CommentSchema = require('../models/Comments.js');
var Comment = mongoose.model('Comment');


//
// Setup the various api routes
// 


// GET home page
router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the Go Filter Yourself api!'
    });
});


// Intercept post id param for update, show, and delete
router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);
    query.exec(function(err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error("Can't find post"));
        }
        req.post = post;
        return next();
    });
});


// GET index of posts
router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
        if (err) {
            return next(err);
        }
        res.json(posts);
    });
});


// POST a post
router.post('/posts', function(req, res, next) {
    var post = new Post(req.body);
    post.save(function(err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});


// GET show for a post given it's id
router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});


// DELETE a post given it's id
router.delete('/posts/:post', function(req, res, next) {
    req.post.remove(function(err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});


// PUT/UPDATE a post
router.put('/posts/:post', function(req, res, next) {
    Post.findByIdAndUpdate(req.post._id, req.body, {
            new: true
        })
        .then((post) => {
            res.json({
                post
            });
        })
        .catch((err) => {
            if (err) {
                console.log('Failed to Update.', err);
                res.json({
                    Error: 'Failed to Update.'
                });
            }
        });
});


// Use a PUT/UPDATE to increment upvote key value in a post
router.put('/posts/:post/upvote', function(req, res, next) {
    req.post.upvote(function(err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});


// Comment routes


// Intercept comment id param for update, show, and delete
router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);
    query.exec(function(err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error("can't find comment"));
        }
        req.comment = comment;
        return next();
    });
});


// POST a comment nested within a post
router.post('/posts/:post/comments', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }
        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
});


// PUT/UPDATE a comment nested within a post
router.put('/posts/:post/comments/:comment', function(req, res, next) {
    Comment.findByIdAndUpdate(req.comment._id, req.body, {
            new: true
        })
        .then((comment) => {
            res.json({
                comment
            });
        })
        .catch((err) => {
            if (err) {
                console.log('Failed to Update Comment', err);
                res.json({
                    Error: 'Failed to Update Comment'
                });
            }
        });
});


// Use a PUT/UPDATE to increment upvote key value in a comment nested in a post
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
    req.comment.upvote(function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});


// DELETE a comment nested in a post and it's associated ref in post
router.delete('/posts/:post/comments/:comment', function(req, res, next) {
    req.post.removeCommentRef(req.comment._id, function(err, comment) {
        if (err) {
            return next(err);
        }
    });
    req.comment.remove(function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});


// GET a comment nested in a post
router.get('/posts/:post/comments/:comment', function(req, res, next) {
    req.comment.populate('posts', function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});


// GET index of comments
router.get('/comments', function(req, res, next) {
    Comment.find(function(err, comments) {
        if (err) {
            return next(err);
        }
        res.json(comments);
    });
});


// GET a comment given it's id
router.get('/comments/:comment', function(req, res, next) {
    req.comment.populate('posts', function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});


// DELETE a comment given it's id
router.delete('/comments/:comment', function(req, res, next) {
    req.comment.remove(function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});


// GET to view all routes
router.get("/routes", function(req, res) {
    console.log(router.stack);
    res.json(router.stack);
});


// GET for undefined routes
router.get('/*', function(req, res) {
    res.json({
        message: "There's nothing to see here... move along... move along..."
    });
});




module.exports = router;
