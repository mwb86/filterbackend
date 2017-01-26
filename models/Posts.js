var mongoose = require('mongoose');

var CommentSchema = require('./Comments.js');
var Comment = mongoose.model('Comment');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

// removes comment reference from post's comment array after a comment delete
PostSchema.methods.removeCommentRef = function(cref, cb) {
  this.comments = this.comments.filter(function(val){
    return val != cref.toString();
  });
  this.save(cb);
};

PostSchema.pre('remove', function(next) {
  Comment.remove({post: this._id}).exec();
  next();
});

mongoose.model('Post', PostSchema);
