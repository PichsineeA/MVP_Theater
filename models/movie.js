const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: String,
    date: String,
    time: String,
    status: String,
    category: String,
    image: String,
    video: String,
    synopsis: String,
    director: String,
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
});

module.exports = mongoose.model('Movie', movieSchema);