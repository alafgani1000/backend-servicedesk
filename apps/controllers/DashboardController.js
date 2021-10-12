const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const moment = require('moment');
const dbconfig = require('../configs/db.config');
const Incidents = dbconfig.incidents;
const Requests = dbconfig.requests;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;

exports.countIncidentEmit = async socket => {
    const stageOpen = await Incidents.findAll({
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'] ],
        where:{ id: { [Op.eq]: 'Open' }}
    }).then(result => {
        return result[0].dataValues.count
    });

    const stageNew = await Incidents.findAll({
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        where:{ id: {[Op.eq]: 'New'}}
    }).then(result => {
        return result[0].dataValues.count
    })

    const stageClose = await Incidents.findAll({
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        where:{ id: {[Op.eq]: 'Close'}}
    }).then(result => {
        return result[0].dataValues.count
    })

    const stageResolve = await Incidents.findAll({
        attributes:[[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        where:{ id: {[Op.eq]: 'Resolve'}}
    }).then(result => {
        return result[0].dataValues.count
    })

    let data = {
        "new":stageNew,
        "open":stageOpen,
        "resolve":stageResolve,
        "close":stageClose
    }
    socket.emit('countIncident', data);
}

exports.countRequestEmit =  async socket => {
    const stageNew = await Requests.findAll({
        attributes:[[Sequelize.fn('COUNT',Sequelize.col('id')), 'count']],
        where:{ id:{ [Op.eq]: 'New' } }
    }).then(result => {
        return result[0].dataValues.count
    })

    const stageOpen = await Requests.findAll({
        attributes:[[Sequelize.fn('COUNT',Sequelize.col('id')), 'count']],
        where:{ id:{ [Op.eq]: 'Open' } }
    }).then(result => {
        return result[0].dataValues.count
    })

    const stageResolve = await Requests.findAll({
        attributes:[[Sequelize.fn('COUNT',Sequelize.col('id')), 'count']],
        where:{ id:{ [Op.eq]: 'Resolve' } }
    }).then(result => {
        return result[0].dataValues.count
    })

    const stageClose = await Requests.findAll({
        attributes:[[Sequelize.fn('COUNT',Sequelize.col('id')), 'count']],
        where:{ id:{ [Op.eq]: 'Close' } }
    }).then(result => {
        return result[0].dataValues.count
    })

    let data = {
        "new":stageNew,
        "open":stageOpen,
        "resolve":stageResolve,
        "close":stageClose
    }
    socket.emit('countRequest', data);
}

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

