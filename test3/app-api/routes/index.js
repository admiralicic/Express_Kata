const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authentication');
const authorize = require('../config/authorize');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

router.get('/protected', authorize, (req, res) => {
  res.status(200).json({ message: 'Hi from secured route!' });
});

module.exports = router;