const   express         = require('express'),
        router          = express.Router(),
        Movie           = require('../models/movie'),
        Cinemas         = require('../models/cinemas'),
        Theater         = require('../models/theater'),
        Showtime        = require('../models/showtime'),
        Seat           = require('../models/seat'),
        Transaction     = require('../models/transaction'),
        middleware      = require('../middleware');


let today = new Date(),
    dd = String(today.getDate()).padStart(2, '0').toLocaleString('en-US',{timeZone:'Asia/Bangkok'}),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

router.get("/", function (req, res) {

    Movie.find({status: "Now Showing"}, function(err, allmovie){
        if (err) {
            console.log(err);
        } else {
            res.render("movie.ejs", { movie: allmovie });
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

router.get('/movieInfo/:id/booking', function(req, res){
    req.session.fromUrl = req.originalUrl;
    Movie.findById(req.params.id).populate('comment').exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else{ 
            Cinemas.find({movies: {$elemMatch: {$eq: req.params.id}}}).populate({
                path: "theater",
                populate: {
                    path: "showtime",
                }
            }).exec(function(err, foundCinema){
                if(err){
                    console.log(err);
                }else{
                    res.render('bookingCinema.ejs', {movie: foundMovie, cinemas: foundCinema});
                }
            })
        }
    });
});

router.get('/cinemas/:id', function(req, res){
    req.session.fromUrl = req.originalUrl;
    Cinemas.findById(req.params.id).populate([{
        path: "theater", 
        option: {sort: {theaterNo: 1}}, 
        populate: {
            path: "showtime", 
            options: {sort: {time: 1 }}, 
            populate: [
                {path: "movie"}, 
                {path:"seat"}
            ]
        }
    },{path: "movies", populate: {path: "comment"}}
    ]).exec(function(err, foundCinema){
        if(err){
            console.log(err);
        } else{
            res.render('cinemasInfo.ejs', {cinemas: foundCinema}); 
        }
    });
});

router.get('/cinemas/:id/showtime/:showtime_id', function(req, res){
    req.session.fromUrl = req.originalUrl;
    Showtime.findById(req.params.showtime_id).populate([{path: 'movie'}, {path: 'seat'}]).exec(function(err, foundShowtime){
        if(err){
            console.log(err);
        }else{
            Theater.findOne({showtime: {$elemMatch: {$eq: foundShowtime._id}}}).exec(function(err, foundTheater){
                if(err){
                    console.log(err);
                }else{
                    res.render('showtime.ejs', {cinemas_id: req.params.id, showtime: foundShowtime, theater: foundTheater});
                }
            
            });
        }
    });
});

router.post('/cinemas/:id/showtime/:showtime_id/transaction', middleware.isLoggedIn, function(req, res){
    const   seatNo = req.body.seatNo,
            count = seatNo.length,
            total = 140*count,
            subTotal = total*0.93,
            vat = total*0.07;
    Showtime.findById(req.params.showtime_id).populate([{path: 'movie'}, {path: 'seat'}]).exec(function(err, foundShowtime){
        if(err){
            console.log(err);
        }else{
            Theater.findOne({showtime: {$elemMatch: {$eq: foundShowtime._id}}}).exec(function(err, foundTheater){
                if(err){
                    console.log(err);
                }else{
                    Cinemas.findById(req.params.id, function(err, foundCinema){
                        if(err){
                            console.log(err);
                        }else{
                            res.render('transaction.ejs', {
                                cinemas: foundCinema,
                                showtime: foundShowtime,
                                seatNo: seatNo, 
                                count: count, 
                                total: total,
                                subTotal: subTotal,
                                vat: vat,
                                theater: foundTheater
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/cinemas/:id/showtime/:showtime_id/checkout', middleware.isLoggedIn, function(req, res){
    Showtime.findById(req.params.showtime_id, function(err, foundShowtime){
        if(err){
            console.log(err);
        }else{
            Seat.find({$and:[{_id: foundShowtime.seat}, {seatNo: req.body.seatNo}]}).exec(function(err, foundSeat){
                if(err){
                    console.log(err);
                }else{
                    foundSeat.forEach(function(seat){
                        seat.customer = req.user._id;
                        seat.available = false;
                        seat.save();
                    });                    
                }
            });
        }
    });    
    Transaction.create(req.body.transaction, function(err, createTransaction){
        if(err){
            console.log(err);
        }else{
            res.redirect('/user/:id/history');
        }
    })
});

router.get('/sortByDate', function(req, res){
    Movie.find({status: "Now Showing"}, function(err, movieLists){
        if(err){
            req.flash('error', err.message);;
            res.redirect('/');
        }else{
            movieLists.sort((a, b) => (a.date > b.date) ? 1 : -1);
            res.render('sortMovie.ejs', {movie: movieLists});
        }
    });
});

router.get('/sortByTime', function(req, res){
    Movie.find({status: "Now Showing"}, function(err, movieLists){
        if(err){
            req.flash('error', err.message);;
            res.redirect('/');
        }else{
            movieLists.sort((a, b) => (a.time > b.time) ? 1 : -1);
            res.render('sortMovie.ejs', {movie: movieLists});
        }
    });
});

module.exports = router;