const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, callback) => {
  User.findOne({ username: username }).then((user) => {
    if (!user) {
      return callback(null, false, 'Username not found.');
    }

    user.validPassword(password).then((isValid) => {
      if (!isValid) {
        return callback(null, false, 'Invalid password.');
      }

      callback(null, user);
    });
  }).catch((err) => {
    callback(err, false);
  });
}));