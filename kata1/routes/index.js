const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authentication');
const auth = require('../config/authorize');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

router.get('/secured', auth, (req, res) => {
  res.status(200).json({ message: 'Hello from secured endpoint' });
});

module.exports = router;
