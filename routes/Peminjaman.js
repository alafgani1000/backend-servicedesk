const express = require('express');
const router = express.Router();
const peminjamanController = require('../apps/controllers/PeminjamanController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');


router.post('/create', 
    auth.isAuth, 
    peminjamanController.pinjam
);
