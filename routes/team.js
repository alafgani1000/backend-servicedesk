const express = require('express');
const  router = express.Router();
const TeamController = require('../apps/controllers/TeamController');
const auth = require('../apps/middlewares/auth');
const AuthHelp =  require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.get('/', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), TeamController.getTeams);
router.get('/:id', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), TeamController.getTeam);
router.post('/store', [
        check('name').notEmpty()
    ],
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')),
    TeamController.storeTeam
);
router.put('/:id/update',[
        check('name').notEmpty()
    ],
    auth.isAuth,
    auth.hashRole(AuthHelp.role('admin')),
    TeamController.updateTeam
)
router.delete('/:id/delete', TeamController.deleteTeam);

module.exports = router;