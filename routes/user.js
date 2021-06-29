const express = require('express');
const router = express.Router();
const UserController = require('../apps/controllers/UserController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.post('/store', UserController.storeUser);
router.get('/:id', auth.isAuth, UserController.getUser);

// admin route
router.get('/admin/all', 
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')), 
    UserController.getUsers);

router.put('/:id/update',[ 
        check('name').notEmpty(),
        check('email').isEmail().normalizeEmail(),
        check('level').notEmpty(),
        check('groupuser').notEmpty()
    ],    
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')),
    UserController.updateUserForAdmin);

router.delete('/:id/delete', 
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')),
    UserController.destroyUser);

module.exports = router;