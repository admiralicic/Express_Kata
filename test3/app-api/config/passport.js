const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');

passport.use(new LocalStrategy({}, (username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(err, null, { message: 'Invalid username' });
    }

    if (user) {
      user.validPassword(password).then((isValid) => {
        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      }).catch((err) => {
        return done(err);
      });
    }
  });
}));