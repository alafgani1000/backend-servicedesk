const express = require('express');
const  router = express.Router();
const StageController = require('../apps/controllers/StageController');
const auth = require('../apps/middlewares/auth');
const AuthHelp =  require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.get('/', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), StageController.getStages);
router.get('/:id', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), StageController.getStage);
router.post('/store', [
        check('text').notEmpty(),
        check('description').notEmpty(),
    ],
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')),
    StageController.storeStage
);
router.put('/:id/update',[
        check('text').notEmpty(),
        check('description').notEmpty(),
    ],
    auth.isAuth,
    auth.hashRole(AuthHelp.role('admin')),
    StageController.updateStage
)
router.delete('/:id/delete', StageController.deleteStage);

module.exports = router;