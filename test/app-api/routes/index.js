var express = require('express');
var router = express.Router();
var authorize = require('../config/authorize');

var authCtrl = require('../controllers/authorization');

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.get('/secured', authorize, function (req, res) {
    res.status(200).json({ message: 'success' });
    return;
});

module.exports = router;