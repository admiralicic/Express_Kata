const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');

// passport.use(new LocalStrategy({
//   usernameField: 'email'
// },
//   (username, password, done) => {
//     User.findOne({ email: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: 'Invalid email' });
//       }

//       user.validPassword(password).then((isValid) => {
//         if (isValid) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: 'Invalid password' });
//         }
//       }).catch((err) => {
//         return done(err);
//       });
//     });
//   }
// ));

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (username, password, done) => {
  User.findOne({ email: username }).select('+password').exec().then((user) => {
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    user.validPassword(password).then((isValid) => {
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Wrong password' });
      }
    });
  }).catch((err) => {
    return done(err);
  });
}
));