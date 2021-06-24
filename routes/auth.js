const express = require('express');
const router = express.Router();
const AuthController = require('../apps/controllers/AuthController');

router.post('/sign',AuthController.signIn);

module.exports = router;