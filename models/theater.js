const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    theaterNo: String,
    showtime: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showtime'
        }
    ],
    
});

module.exports = mongoose.model('Theater', theaterSchema);