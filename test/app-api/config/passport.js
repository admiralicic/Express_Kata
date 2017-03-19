var passport = require('passport');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({},
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) return done(err);

            if (!user) return done(null, false, { message: 'Incorrect username or password' });

            user.validPassword(password)
                .then((isValid) => {
                    if (isValid === true) {
                        done(null, user);
                    } else {
                        done(null, false, { message: 'Incorrect username or password' });
                    }
                })
                .catch((err) => {
                    done(err, false);
                });
            
        });
}));