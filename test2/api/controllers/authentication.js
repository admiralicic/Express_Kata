const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

module.exports.login = (req, res)=>{
    if (!req.body.username || !req.body.password) {
        res.status(401).json({ message: 'All fields are required' });
        return;
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(401).json(err);
            return;
        }

        if (!user) {
            res.status(401).json(info);
            return;
        }

        let token = user.generateJWT();
        res.status(200).json({token: token});
    })(req,res);
}

module.exports.register = (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.name || !req.body.email) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    User.findOne().or([{ username: req.body.username }, { email: req.body.email }]).exec()
        .then((user) => {
            if (user) {
                res.status(400).json({ message: "Username or Email already taken" });
                return;
            }

            user = new User();
            user.username = req.body.username;
            user.name = req.body.name;
            user.email = req.body.email;

            user.hashPassword(req.body.password)
                .then((hash) => {
                    user.hash = hash;
                    return user.save();
                })
                .then((user) => {
                    let token = user.generateJWT();
                    res.status(200).json({ token: token });
                    return;
                })
                .catch((err) => {
                    res.status(400).json(err);
                });
        });
};