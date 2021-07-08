const express = require('express');
const router = express.Router();
const incidentControllers = require('../apps/controllers/IncidentController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const multer = require('multer');
const storage = require('../apps/middlewares/upload');
const upload = multer({ storage:storage });

router.get('/', auth.isAuth, incidentControllers.viewIncidents);
router.get('/:id', auth.isAuth, incidentControllers.viewIncident);
router.post('/create', 
    auth.isAuth, 
    incidentControllers.createIncident 
);
router.patch('/:id/ticket', [
        check('team_id').notEmpty(),
        check('ticket').notEmpty(),
        check('category_id').notEmpty(),
        check('stage_id').notEmpty()
    ],
    auth.isAuth,
    incidentControllers.inputTikcet
);

module.exports = router;