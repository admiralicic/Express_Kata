const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

module.exports.register = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  let user = new User();
  user.username = req.body.username;
  user.hashPassword(req.body.password).then((hash) => {
    user.hash = hash;
    return user.save();
  }).then((user) => {
    let token = user.generateJWT();

    res.status(200).json({ token: token });
  }).catch((err) => {
    res.status(400).json({ err: err.message });
  });
};

module.exports.login = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(400).json({ err: err });
    }

    if (!user) {
      return res.status(400).json({ message: info });
    }

    let token = user.generateJWT();
    res.status(200).json({ token: token });
  })(req, res);  

};