const express = require('express');
const  router = express.Router();
const CategoryController = require('../apps/controllers/CategoryController');
const auth = require('../apps/middlewares/auth');
const AuthHelp =  require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.get('/', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), CategoryController.getCategories);
router.get('/:id', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), CategoryController.getCategory);
router.post('/store', [
        check('name').notEmpty(),
        check('interval').notEmpty(),
    ],
    auth.isAuth, 
    auth.hashRole(AuthHelp.role('admin')),
    CategoryController.storeCategory
);
router.put('/:id/update',[
        check('name').notEmpty(),
        check('interval').notEmpty(),
    ],
    auth.isAuth,
    auth.hashRole(AuthHelp.role('admin')),
    CategoryController.updateCategory
)
router.delete('/:id/delete', CategoryController.deleteCategory);

module.exports = router;