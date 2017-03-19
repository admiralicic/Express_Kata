var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

module.exports.register = function (req, res, next) {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(401).json({ message: 'All fields are required' });
    }

    User.findOne().or([{ username: req.body.username }, { email: req.body.email }]).exec()
        .then(function (user) {
            if (user)
                return res.status(400).json({ message: 'Username or email already taken' });

            var user = new User();
            user.username = req.body.username;
            user.email = req.body.email;
            user.name = req.body.name;

            user.setPassword(req.body.password)
                .then((hash) => {
                    user.hash = hash;
                    user.save((err) => {
                        if (err) return res.status(400).json(err);

                        var token = user.generateJwt();
                        return res.status(200).json({ token: token });
                    });
                })
                .catch((err) => {

                });
        });


}

module.exports.login = function (req, res, next) {
    if (!req.body.username || !req.body.password)
        return res.status(401).json({ message: 'All fields are required' });

    passport.authenticate('local', function (err, user, info) {
        if (err) return res.status(404).json(err);

        if (user) {
            let token = user.generateJwt();
            res.status(200).json({ token: token });
        }
    })(req, res);
}
