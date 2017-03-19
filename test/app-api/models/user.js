var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    hash: String
});

// userSchema.methods.setPassword = function (password, done) {
//     bcrypt.hash(password, null, null, function (err, hash) {
//         if (err) return done(err);
//         done(null, hash);
//     });
// }

userSchema.methods.setPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) return reject(err);
            
            resolve(hash);
        });
    });
};

// userSchema.methods.validPassword = function (password, done) {
//     bcrypt.compare(password, this.hash, function (err, isValid) {
//         if (err) return done(err);
            
//         done(null, isValid);
//     });
// }

userSchema.methods.validPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.hash, (err, isValid) => {
            if (err) return reject(err);

            resolve(isValid);
        });
    });  
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);
}


module.exports = mongoose.model('User', userSchema);