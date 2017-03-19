const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: String
});

userSchema.methods.hashPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, null, null, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

userSchema.methods.validPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isValid) => {
      if (err) {
        reject(err);
      } else {
        resolve(isValid);
      }
    });
  });
};

userSchema.methods.generateJWT = function () {
  let expires = new Date();
  expires.setDate(expires.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email,
    name: this.name,
    exp: parseInt(expires.getTime() / 1000)
  }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('User', userSchema);