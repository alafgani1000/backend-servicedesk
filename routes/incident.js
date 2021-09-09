const express = require('express');
const router = express.Router();
const incidentControllers = require('../apps/controllers/IncidentController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const multer = require('multer');
const storage = require('../apps/middlewares/upload');
const { incidentAttachments } = require('../apps/configs/db.config');
const upload = multer({ storage:storage });

router.get('/', auth.isAuth, incidentControllers.viewIncidents);
router.get('/:id', auth.isAuth, incidentControllers.viewIncident);
router.post('/create', 
    auth.isAuth, 
    incidentControllers.createIncident 
);
router.patch('/:id/ticket', [
        check('team_id').notEmpty(),
        check('category_id').notEmpty()
    ],
    auth.isAuth,
    incidentControllers.inputTikcet
);
router.patch('/:id/update',
    auth.isAuth,
    incidentControllers.updateIncident    
)
router.patch('/:id/resolve',
    auth.isAuth,
    incidentControllers.resolve
);
router.patch('/:id/close', 
    auth.isAuth,
    incidentControllers.close
);
router.patch('/:id/attachment',
    auth.isAuth,
    incidentControllers.updateAttachment
);
router.delete('/:id/delete',
    auth.isAuth,
    incidentControllers.deleteAttachment
);
router.post('/attachment',
    auth.isAuth,
    incidentControllers.inputAttachment
);
router.delete('/:id/incidentdelete',
    auth.isAuth,
    incidentControllers.deleteIncident
);
module.exports = router;