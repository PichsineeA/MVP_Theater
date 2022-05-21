const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require('mongoose'),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      flash          = require('connect-flash'), 
      Movie          = require('./models/movie'),
      methodOverride = require('method-override'),
      Comment        = require('./models/comment'),
      User           = require('./models/user'),
      seedDB         = require('./seed');

const indexRoutes   = require('./routes/index'),
      movieRoutes   = require('./routes/movie'),
      adminRoutes   = require('./routes/admin'),
      userRoutes   = require('./routes/user'),
      commentRoutes = require('./routes/comment');


mongoose.connect('mongodb://localhost/MVP_Theater');
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

 app.use(require('express-session')({
    secret: 'secret word',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/movie', movieRoutes);
app.use('/movieInfo/:id/comment', commentRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/theater', adminRoutes);


app.listen(3000, function () {
    console.log("Activated");
});