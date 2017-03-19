const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports.login = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'Username or password missing' });
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
    res.status(200).json({ token: token });
  })(req, res);
};

module.exports.register = (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password || !req.body.name) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  
  let user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.name = req.body.name;

  user.hashPassword(req.body.password)
    .then((hash) => {
      user.password = hash;
      user.save((err, user) => {
        if (err) {
          res.status(400).json(err);
          return;
        }
        let token = user.generateJWT();
        res.status(200).json({ token: token });
      });
    })
    .catch((err) => {
      res.status(400).json(err);
      return;
    });
};