const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: 'Email or password missing' });
    return;
  }  

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    console.log(req);
    if (!user) {
      res.status(400).json(info);
      return;
    }

    let token = user.generateJWT();
    res.status(200).json({ token: token, user: { _id: user._id, email: user.email, name: user.name } });
  })(req, res);  
  
};

module.exports.register = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  let user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.hashPassword(req.body.password).then((hash) => {
    user.password = hash;

    user.save((err, user) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }
      let token = user.generateJWT();

      res.status(200).json({ token: token, user: {_id: user._id, email: user.email, name: user.name } });
      return;
    });
  }).catch((err) => {
    res.status(400).json(err);
  });
};
