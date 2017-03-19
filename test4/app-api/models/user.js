const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  name: { type: String, required: true }
});

userSchema.methods.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(5, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) return reject(err);
        
        return resolve(hash);
      });
    });
  });
};

userSchema.methods.validPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isValid) => {
      if (err) return reject(err);

      return resolve(isValid);
    });
  });
};

userSchema.methods.generateJWT = () => {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  let token = jwt.sign({
    _id: this._id,
    email: this._email,
    name: this._name,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.JWT_SECRET);

  return token;
};

module.exports = mongoose.model('User', userSchema);