const   express       = require('express'),
        router        = express.Router({mergeParams: true}),
        Movie         = require('../models/movie'),
        User         = require('../models/user'),
        Comment       = require('../models/comment');

const   middlewareObj = {};

middlewareObj.checkCommentOwner = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.id, (err,foundComment) => {
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.admin == true){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error','You need to login first.');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', "You do not have permission to do this action!. Pleas login first");
    res.redirect('/')
}

module.exports = middlewareObj;