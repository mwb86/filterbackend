var express = require('express');
var router = express.Router();

var PostSchema = require('../models/Posts.js');
var CommentSchema = require('../models/Comments.js');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
mongoose.Promise = global.Promise;

// var mongoose = require('mongoose');
// var Post = require('../models/Posts');  //changed to require
// var Comment = require('../models/Comments');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }
    res.json(posts);
  });
});


router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  post.save(function(err, post){
    if(err){ return next(err); }
    res.json(post);
  });
});


router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);
  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }
    req.post = post;
    return next();
  });
});


router.param('comment', function(req, res, next, id) {
 var query = Comment.findById(id);
 query.exec(function (err, comment){
   if (err) { return next(err); }
   if (!comment) { return next(new Error("can't find comment")); }
   req.comment = comment;
   return next();
 });
});


router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }
    res.json(post);
  });
});


router.delete('/posts/:post', function(req, res, next) {
  req.post.remove(function(err, post) {
    if (err) { return next(err); }
    res.json(post);
  });
});


router.put('/posts/:post', function(req, res, next) {
  Post.findByIdAndUpdate(req.post._id, req.body, {new:true})
      .then((post) => {
        res.json({post});
      })
      .catch((err) => {
        if(err) {
          console.log('Failed to Update', err);
          res.json({Error: 'Failed to Update'});
        }
      });
});


router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
});


router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.save(function(err, comment){
    if(err){ return next(err); }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }
      res.json(comment);
    });
  });
});


router.put('/posts/:post/comments/:comment',  function(req, res, next) {
  Comment.findByIdAndUpdate(req.comment._id, req.body, {new:true})
      .then((comment) => {
        res.json({comment});
      })
      .catch((err) => {
        if(err) {
          console.log('Failed to Update Comment', err);
          res.json({Error: 'Failed to Update Comment'});
        }
      });
});


router.put('/posts/:post/comments/:comment/upvote',  function(req, res, next) {
 req.comment.upvote(function(err, comment){
   if (err) { return next(err); }
   res.json(comment);
 });
});


router.delete('/posts/:post/comments/:comment',  function(req, res, next) {
 req.post.removeCommentRef(req.comment._id,function(err, comment){
   if (err) { return next(err); }
 });
 req.comment.remove(function(err, comment){
   if (err) { return next(err); }
   res.json(comment);
 });
});


router.delete('/comments/:comment', function(req, res, next) {
  req.comment.remove(function(err, comment) {
    if (err) { return next(err); }
    res.json(comment);
  });
});


module.exports = router;
