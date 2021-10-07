const express = require('express');
const router = express.Router();
const requestControllers = require('../apps/controllers/RequestController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const multer = require('multer');
const storage = require('../apps/middlewares/upload');
const { route } = require('./incident');
const upload = multer({ storage:storage });

router.get('/',
    auth.isAuth,
    requestControllers.viewRequests
);
router.get('/:id/',
    auth.isAuth,
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
router.patch('/:id/attachment',
    auth.isAuth,
    requestControllers.updateAttachment
)
router.patch('/:id/update',
    auth.isAuth,
    requestControllers.updateRequest
);
router.delete('/:id/delete',
    auth.isAuth,
    requestControllers.deleteAttachment
)
router.post('/attachment',
    auth.isAuth,
    requestControllers.inputAttachment
)
router.delete('/:id/deleteDev',
    auth.isAuth,
    requestControllers.deleteDeveloper
)

module.exports = router;