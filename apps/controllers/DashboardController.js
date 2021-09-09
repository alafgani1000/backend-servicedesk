const { Op } = require('sequelize');
const multer = require('multer');
const moment = require('moment');
const dbconfig = require('../configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;

exports.dataIncident = async () => {
    jumIncident = await Incidents.findAndCountAll({
    })
    .then(result => {
        return result;
    })

    return jumIncident;
}