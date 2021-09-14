const { Op, Sequelize, where } = require('sequelize');
const multer = require('multer');
const moment = require('moment');
const dbconfig = require('../configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;

exports.countNewIncident = async socket => {
    const countNewIncident = await Incidents.findAll({
        where:{
            stageId:1    
        },
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'] ]
    })
    .then(result => {
        return result[0].dataValues.count
    });

    socket.emit('countNewIncident', countNewIncident);
};
