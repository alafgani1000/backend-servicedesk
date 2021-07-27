const express = require('express');
const router = express.Router();
const requestControllers = require('../apps/controllers/RequestController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const multer = require('multer');
const storage = require('../apps/middlewares/upload');
const upload = multer({ storage:storage });

router.get('/',
    router.isAuth,
    requestControllers.viewRequests
);
router.get('/:id/',
    router.isAuth,
    requestControllers.viewRequest
);
router.post('/create', 
    auth.isAuth, 
    requestControllers.createRequest 
);
router.patch('/:id/open',
    auth.isAuth,
    requestControllers.openRequest
);
router.patch('/:id/resolve',
    auth.isAuth,
    requestControllers.resolveRequest
);
router.patch('/:id/close',
    auth.isAuth,
    requestControllers.closeRequest
);

module.exports = router;