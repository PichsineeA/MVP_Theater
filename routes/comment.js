const express       = require("express"),
      router        = express.Router({mergeParams: true}),
      Movie         = require('../models/movie'),
      Comment       = require('../models/comment'),
      Cinemas        = require('../models/cinemas'),
      middleware    = require('../middleware');

router.post("/", middleware.isLoggedIn, function (req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();    
                    foundMovie.comment.push(comment);
                    foundMovie.save();
                    res.redirect('/movieInfo/'+ foundMovie._id);
                }
            })
        }
    })
});

module.exports = router;