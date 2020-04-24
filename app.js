var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Dependancies g to be used on this project
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//setup connection to MongoDB database
MongoClient.connect('mongodb://localhost:27017/blogdb', (err, client) => {
  if (err) {
    throw err;
  }
  const db = client.db('blogdb');
  const posts = db.collection('posts');
  const users = db.collection('users');
  app.locals.posts = posts;
  app.locals.users = users;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret:'secret123',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  passReqToCallback: true,
},
  (username, password, authCheckDone) => {
    app.locals.users
    .findOne({ username })
    .then(user => {
      if(!user){
        return authCheckDone(null, false, req.flash('error', 'User not found.'));
      }
      
      if(user.password !== password) {
        return authCheckDone(null, false, req.flash('error', 'Password Incorrect!'));
      }

      return authCheckDone(null, false);
      
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
