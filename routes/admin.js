const theater = require('../models/theater');

const express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    Movie = require('../models/movie'),
    User = require('../models/user'),
    Cinemas = require('../models/cinemas'),
    Theater = require('../models/theater'),
    Showtime = require('../models/showtime'),
    Seat = require('../models/seat'),
    multer = require('multer'),
    path = require('path'),
    middleware = require('../middleware'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                callback(null, './public/assets/img/poster/');
            } else if (file.originalname.match(/\.(mp4)$/i)) {
                callback(null, './public/assets/video/');
            }

        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        }
    }),
    fileFilter = function (req, file, callback) {
        if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            callback(null, true);
        }
        else if (file.originalname.match(/\.(mp4)$/i)) {
            callback(null, true);
        } else {
            return callback(new Error('Only jpg, jpeg, png and mp4 can been accept'), false);
        }
    },
    upload = multer({ storage: storage, fileFilter: fileFilter });


router.get("/", function (req, res) {
    Movie.find({}, function (err, allmovie) {
        if (err) {
            console.log(err);
        } else {
            res.render("admin/admin.ejs", { movie: allmovie });
        }
    })
});

var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }])
router.post("/addmovie", middleware.isLoggedIn, cpUpload, function (req, res, next) {
    req.body.movie.image = '/assets/img/poster/' + req.files["image"][0].filename;
    req.body.movie.video = '/assets/video/' + req.files["video"][0].filename;
    Movie.create(req.body.movie, function (err, newlyAdded) {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/admin');
        }
    })
});

router.get("/:id/edit", function (req, res) {
    Movie.findById(req.params.id, function (err, foundmovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('admin/editmovie.ejs', { movie: foundmovie })
        }
    });
});

var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }])
router.put("/:id", middleware.isLoggedIn, cpUpload, function (req, res) {
    if (req.files) {
        req.body.image = '/assets/img/poster/' + req.files["image"][0].filename;
        req.body.video = '/assets/video/' + req.files["video"][0].filename;
    }
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function (err, updatedMovie) {
        if (err) {
            console.log(err);
            res.redirect('/admin/');
        } else {
            res.redirect('/movieInfo/' + req.params.id);
        }
    })
})

router.delete('/:id', function (req, res) {
    Movie.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect('/admin/');
        } else {
            res.redirect('/movie');
        }
    });
});

router.get("/cinemas", function (req, res) {
    Cinemas.find({}, function (err, allcinemas) {
        if (err) {
            console.log(err);
        } else {
            res.render("admin/admin-cinemas.ejs", { cinemas: allcinemas });
        }
    })
});

router.get('/cinemas/:id/', function (req, res) {
    Cinemas.findById(req.params.id).populate('movies').exec(function (err, foundCinema) {
        if (err) {
            console.log(err);
        } else {
            Movie.find({ _id: { $nin: foundCinema.movies } }).exec(function (err, foundAdddMovie) {
                if (err) {
                    console.log(err);
                } else {
                    Movie.find({ _id: { $in: foundCinema.movies } }).exec(function (err, foundRemoveMovie) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('admin/admin-selectmovie', { cinemas: foundCinema, movieAdd: foundAdddMovie, movieRemove: foundRemoveMovie });
                        }
                    });
                }
            });
        }
    });
});

router.post('/:id/addmovie/:movie_id', function (req, res) {
    Cinemas.findOneAndUpdate({ "_id": req.params.id }, { $push: { movies: req.params.movie_id } }).exec(function (err, updatedCinema) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/cinemas/' + req.params.id);
        }
    });
});

router.post('/:id/removemovie/:movie_id', function (req, res) {
    Cinemas.findOneAndUpdate({ "_id": req.params.id }, { $pull: { movies: req.params.movie_id } }).exec(function (err, updatedCinema) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/cinemas/' + req.params.id);
        }
    });
});

router.get('/cinemas/:id/theater/', function (req, res) {
    Cinemas.findById(req.params.id).populate('theater').exec(function (err, foundCinema) {
        if (err) {
            console.log(err);
        } else {
            Theater.find({ _id: { $in: foundCinema.theater } }).exec(function (err, foundRemoveTheater) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('admin/admin-selecttheater', { cinemas: foundCinema, theaterRemove: foundRemoveTheater });
                }
            });
        }
    });
});

router.post('/cinemas/:id/addtheater', function (req, res) {
    Theater.create(req.body.theater, function(err, createTheater){
        if(err){
            console.log(err);
        }else{
            Cinemas.findOneAndUpdate({"_id": req.params.id}, {$push: {theater: createTheater}}).exec(function(err, updatedCinema){
                if(err){
                    console.log(err);
                }else{
                    console.log(createTheater);
                    res.redirect('/admin/cinemas/' + req.params.id + '/theater')
                }
            });
        }
    });
});

router.post('/cinemas/:id/removetheater/:theater_id', function (req, res) {
    Cinemas.findOneAndUpdate({ "_id": req.params.id }, { $pull: { theater: req.params.theater_id } }).exec(function (err, updatedCinema) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/cinemas/' + req.params.id + '/theater');
        }
    });
});

router.get('/cinemas/:id/theater/:theater_id/showtime', function (req, res) {
    Cinemas.findById(req.params.id).populate('movies').exec(function (err, foundCinema) {
        if (err) {
            console.log(err);
        } else {
            Theater.findById(req.params.theater_id).populate({
                path: "showtime",
                options: { sort: { date: 1, time: 1 } },
                populate: [
                    { path: "movie" },
                    { path: "seat" }
                ]
            }).exec(function (err, foundTheater) {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/cinema/' + req.params.id + '/manage');
                } else {
                    res.render('admin/admin-showtime.ejs', { cinema: foundCinema, theater: foundTheater });
                }
            });
        }
    });
});

router.post('/cinemas/:id/theater/:theater_id/showtime', function (req, res) {
    Cinemas.findById(req.params.id).populate('theater').exec(function (err, foundCinema) {
        if (err) {
            console.log(err);
        } else {
            Theater.findById(req.params.theater_id, function (err, foundTheater) {
                if (err) {
                    console.log(err);
                } else {
                    Showtime.create(req.body.showtime, function (err, createShowtime) {
                        if (err) {
                            console.log(err);
                        } else {
                            const alphabetArray = "ABC".split("");
                            var i, row, column, seatNo;
                            numOfSeat = [];
                            for (i = 0; i < 3; i++) {
                                row = alphabetArray[i]
                                for (column = 1; column <= 4; column++) {
                                    seatNo = row + column;
                                    numOfSeat.push({ seatNo: seatNo, seatRow: row, seatColumn: column });
                                }
                            }
                            Seat.insertMany(numOfSeat, function (err, seatCreated) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Showtime.findOneAndUpdate({ "_id": createShowtime._id }, { $push: { seat: seatCreated } }).exec(function (err, updatedShowtime) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            foundTheater.showtime.push(createShowtime._id);
                                            foundTheater.save();
                                            req.flash('success', 'Add showtime complete!!!');
                                            res.redirect('/admin/cinemas/' + req.params.id + '/theater/' + req.params.theater_id + '/showtime');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.delete('/cinemas/:id/theater/:theater_id/showtime/:showtime_id', function (req, res) {
    Showtime.findByIdAndRemove(req.params.showtime_id, function (err, removeShowtime) {
        if (err) {
            console.log(err);
        } else {
            Theater.findById(req.params.theater_id, function (err, foundTheater) {
                if (err) {
                    console.log(err);
                } else {
                    const index = foundTheater.showtime.indexOf(req.params.showtime_id);
                    foundTheater.showtime.splice(index, 1);
                    foundTheater.save();
                    removeShowtime.seat.forEach(function (seatId) {
                        Seat.findByIdAndRemove(seatId, function (err, removeSeat) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(removeSeat);
                            }
                        });
                    });
                    req.flash('success', 'Delete showtime complete!!!');
                    res.redirect('/admin/cinemas/' + req.params.id + '/theater/' + req.params.theater_id + '/showtime');
                }
            });
        }
    })
})

router.get("/user", function (req, res) {
    User.find({}, function (err, alluser) {
        if (err) {
            console.log(err);
        } else {
            res.render("admin/admin-user.ejs", { user: alluser });
        }
    })
});

router.delete('/user/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, deleteUser) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/user');
        } else {
            req.flash('success', 'Delete user complete');
            res.redirect('/user');
        }
    });
});


module.exports = router;