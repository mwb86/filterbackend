# Project 3 -- Backend Server

This is the backend server for project three. It uses Express. It provides api access to a mlab mongo database that is accessed through the AngularJS frontend found here: https://github.com/mwb86/gofilter

Currently being hosted on Heroku:
https://morning-wildwood-94098.herokuapp.com/

This repo was split off from the above repo late into development, so the commit history is short. Early commits can be found there.

Launch via `nodemon` from the project's root.

## API routes

Provides full CRUD for two models (post, comment)
- / ---> GET
- /posts ---> GET, POST
- /posts/:id ---> GET, PUT, DELETE
- /posts/:id/upvote ---> PUT
- /posts/:id/comments ---> POST
- /posts/:id/comments/:id ---> GET, DELETE, PUT
- /posts/:id/comments/:id/upvote ---> PUT
- /comments ---> GET
- /commnets/:id ---> GET, DELETE
- /routes ---> GET
- undefined and invalid routes provide error messages.



## Models

### Post Model Schema
```js
var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    upvotes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
```

### Comment Model Schema
```js
var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {
        type: Number,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});
```
