const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    time: String,
    movie:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie' 
    },
    seat: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seat'
        }
    ]
});

module.exports = mongoose.model('Showtime', showtimeSchema);