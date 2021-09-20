const express = require('express');
const router = express.Router();
const NotificationController = require('../apps/controllers/NotificationController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');

router.get('/incidents', auth.isAuth, NotificationController.incidentNotifications);
router.patch('/:id/read', auth.isAuth, NotificationController.readNotification);

module.exports = router