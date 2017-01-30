var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// const fs = require('fs');

var index = require('./routes/index');

var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/beer_api';
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

var app = express();
app.use(cors());
// app.use(express.static(__dirname + '/temp'));











// var Algorithmia = require('Algorithmia');
// var myphoto = {};
//
// var input = {
//     "images": [
//         "http://i.imgur.com/0M6MKwZ.jpg"
//     ],
//     "savePaths": [
//         "data://mwb86/GAproject3/elon_space_pizza1.jpg"
//     ],
//     "filterName": "space_pizza"
// };
//
//
//
// // app.listen(3000, () => {
// //     console.log("listening on 3000");
//     var client = Algorithmia.client("sim033rYcjutxq05DByz5NS6QfP1");
//
//     app.use("/filterPhoto", (req, res) => {
//         client.algo("algo://deeplearning/DeepFilter/0.6.0")
//             .pipe(input)
//             .then(function(output) {
//                 var myphoto = output;
//                 if (output.error) return console.error("error: " + output.error);
//                 console.log(output.result.savePaths[0]);
//                 console.log(myphoto);
//                 // var getImage = output.result.savePaths[0];
//             });
//     });
//
//     app.use('/getPhoto', (req, res) => {
//         var robots = client.dir("data://.my/GAproject3");
//         // Get the file's contents
//         robots.file("elon_space_pizza1.jpg").get(function(err, data) {
//             // on success, data will be string or Buffer
//             console.log(client);
//             console.log("Received " + data.length + " bytes.");
//             fs.writeFileSync("temp/T-804.jpg", data);
//         });
//     });
//
//     app.get('/showPhoto', function(req, res) {
//         res.sendfile(path.join(__dirname + '/show.html'));
//     });
//
//     app.get('/', function(req, res) {
//         res.sendFile(path.join(__dirname + '/index.html'));
//     });

// });














// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.status || 500);
    // res.render('error');
    res.json({
        'Error': err.message
    });
});


module.exports = app;
