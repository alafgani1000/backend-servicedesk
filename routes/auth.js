const express = require('express');
const router = express.Router();
const AuthController = require('../apps/controllers/AuthController');
const auth = require('../apps/middlewares/auth');

router.post('/sign',AuthController.signIn);
router.post('/checkSign', auth.isAuth, AuthController.checkSign);

module.exports = router;