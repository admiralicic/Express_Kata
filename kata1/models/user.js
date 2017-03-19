const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  hash: String
});

UserSchema.methods.hashPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (salt) => {
      bcrypt.hash(password, salt, null,function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });
};

UserSchema.methods.validPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.hash, function (err, isValid) {
      if (err) {
        reject(err);
      } else {
        resolve(isValid);
      }
    });  
  });
};

UserSchema.methods.generateJWT = function () {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.JWT_SECRET)
};


module.exports = mongoose.model('User', UserSchema);