const   express          = require('express'),
        router             = express.Router(),
        Movie              = require('../models/movie'),
        User               = require('../models/user'),
        Cinemas            = require('../models/cinemas'),
        Comment            = require('../models/comment'),
        middleware         = require('../middleware'),
        multer  = require('multer'),
        path    = require('path'),
        storage = multer.diskStorage({
                    destination: function(req, file, callback){
                        callback(null,'./public/assets/img/');
                    },
                    filename: function(req, file, callback){
                        callback(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
                    },
        }),
        imageFilter = function(req, file, callback){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
                return callback(new Error('Only jpg, jpeg, png and gif.'), false);
            }
            callback(null, true);
        },
        upload = multer({storage: storage, fileFilter: imageFilter}),
        passport= require('passport');

router.get("/", function (req, res) {
    Movie.find({status: "Now Showing"},function(err, allmovies){
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", { movie: allmovies });
        }
    })
});

router.post('/signup', upload.single('profileImage'), function(req, res, next){
    req.body.profileImage = '/assets/img/'+req.file.filename;
    let newUser = new User({username: req.body.username,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            profileImage: req.body.profileImage
    });
    if(req.body.admincode === 'nonsecret'){
        newUser.isAdmin = true;
    }  
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/');
        } else {
            passport.authenticate('local')(req, res, function(){
            req.flash('success', user.username +' Welcome to MVP Theater');
            res.redirect('/');;
            });
        }
    });
});

router.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/movie',
    successFlash: true,
    failureFlash: true,
    successFlash: 'Successfully login',
    failureFlash: 'Invalid username or password'
}), function(req,res){
});

router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'Log you out successfully');
    res.redirect('/');
});

router.get("/cinemas", function (req, res) {
    Cinemas.find({},function(err, allcinemas){
        if (err) {
            console.log(err);
        } else {
             res.render("cinemas.ejs", { cinemas: allcinemas });
        }
    })
});

router.get("/faqs", function (req, res) {
    res.render("faqs.ejs");
});

router.get("/news", function (req, res) {
    Movie.find({status: "Coming Soon"},function(err, allmovies){
        if (err) {
            console.log(err);
        } else {
            res.render("news.ejs", { movie: allmovies });
        }
    })
});

router.get("/movieInfo/:id", function (req, res) {
    Movie.findById(req.params.id).populate('comment').exec(function(err, foundMovie){
        if (err) {
            console.log(err);
        } else {
            res.render("movieInfo.ejs", { movie: foundMovie });
        }
    })
});

router.delete('/comment/:id/delete', middleware.checkCommentOwner,(req,res) =>{
    Comment.findByIdAndRemove(req.params.id, (err,deletedComment) => {
        if(err){
            console.log(err);
        } else {
            Movie.findOneAndUpdate({comments:{_id:req.params.id}},{$pull:{comments:req.params.id}},(err,deleted) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect('back');
                }
            })
        }
    })
})

router.get('/search', function(req, res){
    req.session.fromUrl = req.originalUrl;
    const word = '';
    Movie.find({$or:[{name: {$regex: word, $options:'i'}}, {category: {$regex: word, $options:'i'}}]}).populate("comment").sort({date: 1}).exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            Cinemas.find({branch: {$regex: word, $options: 'i'}}, function(err, foundCinema){
                if(err){
                    console.log(err);
                }else{
                    res.render('search.ejs', {movie: foundMovie, cinema: foundCinema,  word: word});
                }
            });            
        }
    });
})

router.post('/search', function(req, res){
    req.session.fromUrl = req.originalUrl;
    const word = req.body.search;
    Movie.find({$or:[{name: {$regex: word, $options:'i'}}, {category: {$regex: word, $options:'i'}}]}).populate("comment").sort({date: 1}).exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            Cinemas.find({branch: {$regex: word, $options: 'i'}}, function(err, foundCinema){
                if(err){
                    console.log(err);
                }else{
                    res.render('search.ejs', {movie: foundMovie, cinemas: foundCinema,  word: word});
                }
            });            
        }
    });
})
module.exports = router;