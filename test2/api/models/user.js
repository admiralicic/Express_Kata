const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.generateJWT = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        name: this.name,
        username: this.username,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);
};

userSchema.methods.hashPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err)
                return reject(err);
            
            resolve(hash);
        });
    });
};

userSchema.methods.validPassword = function(password){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(password, this.hash, (err, isValid)=>{
            if(err) return reject(err);
            
            resolve(isValid);
        });
    });
};

module.exports = mongoose.model('User', userSchema);