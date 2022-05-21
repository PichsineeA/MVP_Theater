const mongoose              = require('mongoose');
      passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    profileImage: String,
    isAdmin: {type: Boolean, default: false},
    favorite:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)