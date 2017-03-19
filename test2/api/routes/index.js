const express = require('express');

const api = express.Router();
const authCtrl = require('../controllers/authentication');

api.post('/register', authCtrl.register);
api.post('/login', authCtrl.login);


module.exports = api;