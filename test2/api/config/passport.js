const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy(
    (username, password, done) => {
        let usr;
        User.findOne({ username: username }).exec()
            .then((user) => {
                usr = user;
                
                return user.validPassword(password);
            })
            .then((isValid) => {
                if (isValid) {
                    done(null, usr);
                } else {
                    done(null, false, { message: 'Invalid username or password' });
                }
            }).catch((err) => {
                done(err);
            });
    }
));