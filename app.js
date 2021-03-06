var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');

var app = express();

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/stories/:count/:offset', (req, res) => {
    return res.json([
        {
            id: 1,
            upvotes: 6,
            title: 'Man frees cat from tree',
            source: 'foxnews.com'
        },
        {
            id: 2,
            upvotes: 150,
            title: 'Trump concedes to popular vote, Clinton sworn is as 46th president',
            source: 'cnn.com'
        }
    ]);
});

app.get('/story/:id', (req, res) => {
    return res.json({
        id: 1,
        upvotes: 6,
        title: 'Man frees cat from tree',
        source: 'foxnews.com'
    });
}); 

app.get('/story/:id/votes', (req, res) => {
    return res.json({
        upvote_ids: [12, 9830928, 389378, 392183928393, 329382983] 
    });
}); 

app.post('/story/:id/vote', (req, res) => {
    return res.json({
        upvote_ids: [12, 9830928, 389378, 392183928393, 329382983] 
    });
}); 

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
});

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
