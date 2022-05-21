const { join } = require('path');

const express    = require('express'),
      router     = express.Router(),
      Movie      = require('../models/movie'),
      User       = require('../models/user'),
      Transaction       = require('../models/transaction'),
      Cinemas    = require('../models/cinemas'),
      middleware = require('../middleware'),
      multer     = require('multer'),
      path       = require('path'),
      storage    = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/assets/img/');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
    }),
    imageFilter = function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return callback(new Error('Only jpg, jpeg, png and gif.'), false);
        }
        callback(null, true);
    },
      upload     = multer({ storage: storage, fileFilter: imageFilter }),
      passport   = require('passport');

router.get("/:id/profile", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash('error', 'There is something wrong');
            return res.redirect('/');
        } else {
            res.render("user/profile.ejs", { user: foundUser });
        }
    });
});

router.post('/:id', upload.single('profileImage'), function (req, res) {
    if(req.file){
        req.body.user.profileImage = '/assets/img/' + req.file.filename;
    }
    User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect("/");
        } else {
            req.flash('success', 'Change profile complete');
            res.redirect("/");
        }
    });
});

router.delete('/:id', function(req,res){
    User.findByIdAndRemove(req.params.id, function(err, deleteUser) {
        if(err){
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            req.flash('success', 'Delete account complete');
            res.redirect('/');
        }
    });
});

router.get('/:id/favorite', (req,res) => {
    User.findById(req.user.id).populate({path:'favorite',populate:{path:'comment'}}).exec((err,foundUser) => {
        if(err){
            console.log(err);
        } else {
            res.render('user/favorite.ejs',{movie:foundUser.favorite});
        }
    });
});

router.post('/favorite/add/:id', middleware.isLoggedIn, (req,res) => {
    User.findByIdAndUpdate(req.user.id,{$push:{favorite:req.params.id}},{new:true}, (err,favoritemovie) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('back');
        }
    })
})

router.post('/favorite/remove/:id',(req,res) => {
    User.findByIdAndUpdate(req.user.id,{$pull:{favorite:req.params.id}},{new:true}, (err,favoritemovie) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('back');
        }
    })
})

router.get("/:id/history", function (req, res) {

    Transaction.find({'customer': req.user.id}, function(err, allhistory){
        if (err) {
            console.log(err);
        } else {
            res.render("user/history.ejs", { transaction: allhistory });
        }
    })
});

module.exports = router;