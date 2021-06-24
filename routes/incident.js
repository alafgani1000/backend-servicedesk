const express = require('express');
const router = express.Router();
const incidentControllers = require('../apps/controllers/IncidentController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.get('/', auth.isAuth, auth.hashRole(AuthHelp.role('admin')), incidentControllers.viewIncidents);
router.get('/:id', auth.isAuth, auth.isAuth, auth.hashRole(AuthHelp.role('admin')), incidentControllers.viewIncident);

module.exports = router;