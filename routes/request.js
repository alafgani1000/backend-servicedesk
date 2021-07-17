const express = require('express');
const router = express.Router();
const requestControllers = require('../apps/controllers/RequestController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const multer = require('multer');
const storage = require('../apps/middlewares/upload');
const upload = multer({ storage:storage });

router.post('/create', 
    auth.isAuth, 
    requestControllers.createRequest 
);

module.exports = router;