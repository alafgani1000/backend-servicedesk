const express = require('express');
const router = express.Router();
const RoleControllers = require('../apps/controllers/RoleController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.get('/', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), RoleControllers.getUserGroups);
router.get('/:id', auth.isAuth, auth.isAuth, auth.hashRole(AuthHelp.role('admin')), RoleControllers.getUserGroup);
router.post('/store', [ 
        check('role').notEmpty(),
    ],
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')),  
    RoleControllers.storeUserGroup,  
);
router.put('/:id/update',[
        check('role').notEmpty()
    ],
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')), 
    RoleControllers.updateUserGroup
);
router.delete('/:id/delete', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), RoleControllers.deleteUserGroup)

module.exports = router;