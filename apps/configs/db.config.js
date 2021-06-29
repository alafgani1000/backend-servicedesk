const { Sequelize } = require('sequelize');
const { getTeam } = require('../controllers/TeamController');
const IncidentAattachments = require('../models/IncidentAttachments');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.incident = require('../models/Incident');
db.incidentAttachments = require('../models/IncidentAttachments');

db.incident.hasMany(db.incidentAttachments, {
    foreignKey: 'incident_id', 
})
db.incidentAttachments.belongsTo(db.incident);

module.exports = db;