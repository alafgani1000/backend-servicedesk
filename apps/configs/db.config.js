const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.incidents = require('../models/Incident');
db.incidentAttachments = require('../models/IncidentAttachments');
db.categories = require('../models/Category');
db.teams = require('../models/Team');
db.requests = require('../models/Request');
db.requestAttachments = require('../models/RequestAttachment');


db.incidents.hasMany(db.incidentAttachments, { as: "incidentAttachments" });
db.incidentAttachments.belongsTo(db.incidents, {
  foreignKey: "incidentId",
  as: "incidents"
});
db.requests.hasMany(db.requestAttachments, { as: "requestAttachments" });
db.requestAttachments.belongsTo(db.sequelize, {
  foreignKey: "requestId",
  as: "request"
});

module.exports = db;