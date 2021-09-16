const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const moment = require('moment');
const dbconfig = require('../configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;
const Notifications = dbconfig.notifications;

exports.incidentNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.findAll({ 
            where:{
                tableName:'incidents',
                status:0
            }
        })
    } catch(error) {
        res.status(500).json({
            message:error
        });
    }
}