const express = require('express');
const router = express.Router();
const incidentControllers = require('../apps/controllers/IncidentController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const multer = require('multer');
const storage = require('../apps/middlewares/upload');

var upload = multer({ storage: storage })

router.get('/', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), incidentControllers.viewIncidents);
router.get('/:id', auth.isAuth, auth.isAuth, auth.hashRole(AuthHelp.role('admin')), incidentControllers.viewIncident);
router.post('/create',  [ 
        check('text').notEmpty(),
        check('location').notEmpty(),
        check('phone').notEmpty()
    ],
    auth.isAuth, 
    upload.array('file'), 
    incidentControllers.createIncident
);
router.patch('/input/ticket',[
        check('team_id').notEmpty(),
        check('ticket').notEmpty(),
        check('category_id').notEmpty()
    ],
    auth.isAuth,
    incidentControllers.inputTikcet
);

module.exports = router;