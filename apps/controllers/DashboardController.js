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

exports.countIncidentEmit = async socket => {
    const jumIncident = await Incidents.findAll({
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'] ]
    })
    .then(result => {
        return result[0].dataValues.count
    });

    // const response = new Date();
    socket.emit('jumIncident', jumIncident);
};

exports.countIncidentOpen = async socket => {
    const jumIncidentOpen = await Incidents.findAll({
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'] ],
        where:{ id: { [Op.eq]: 'Open' }}
    })
    .then(result => {
        return result[0].dataValues.count
    });

    socket.emit('jumIncidentOpen', jumIncidentOpen);
}