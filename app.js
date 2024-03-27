require('custom-env').env();
var createError = require('http-errors');
var express = require('express');
const expHbs = require('express-handlebars');
const session = require('express-session');
const cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');

var app = express();
const flash = require('connect-flash');

const handlebars = require('./helpers/handlebars');
const auth = require('./helpers/authentication');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postRouter = require('./routes/post');

//connect database
const mongoose = require('mongoose');
mongoose.connect(`${process.env.Project_Url}`).then(() => console.log("Server connected"))
global.userModel = mongoose.model('user', require("./models/user")(mongoose));
global.postModel = mongoose.model('post', require("./models/post")(mongoose));
global.savepostModel = mongoose.model('savepost', require("./models/savepost")(mongoose));
global.ObjectId = mongoose.Types.ObjectId;

// create custom healper
const hbs = expHbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  helpers: handlebars
})
app.engine('hbs', hbs.engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//cookie session
app.use(cookieSession({
  secret: "session",
  key: "abhH4re5Uf4Rd0KnddSsdf05f3V",
}));

//express session
app.use(session({
  secret: "abhH4re5Uf4Rd0KnddS05sdff3V",
  saveUninitialized: true,
  resave: true,
  maxAge: Date.now() + 30 * 86400 * 1000,
  cookie: { secure: true }
}));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport middleware
auth.login(app);
// common middleware
app.use(auth.commonMiddleware);

app.use('/', indexRouter);
app.use(auth.chackAuth);  //chack authenticate user
app.use('/post', postRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
module.exports = app;
