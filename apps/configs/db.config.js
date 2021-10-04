const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: 'Asia/Bangkok'
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
db.stages = require('../models/Stage');
db.users = require('../models/User');
db.roles = require('../models/Role');
db.notifications = require('../models/Notification');
db.actions = require('../models/Action');
db.incidentActions = require('../models/IncidentAction');
db.requestDevelopers = require('../models/RequestDevelopers');

// user role
db.roles.hasMany(db.users, {as:"rolesUsers", foreignKey:"level"});
db.users.belongsTo(db.roles, {
  foreignKey: "level",
  as:"userRole"
})
// user team
db.teams.hasMany(db.users, {as:"teamUsers", foreignKey:"groupuser"});
db.users.belongsTo(db.teams, {
  foreignKey: "groupuser",
  as:"userTeam"
});
// incident attachment
db.incidents.hasMany(db.incidentAttachments, { as:"incidentAttachments" });
db.incidentAttachments.belongsTo(db.incidents, {
  foreignKey: "incidentId",
  as: "incidents"
});
// stage incidents
db.stages.hasMany(db.incidents, { as:"incidentStages"});
db.incidents.belongsTo(db.stages, {
  foreignKey: "stageId",
  as: "stageIncidents"
});
// user incident
db.users.hasMany(db.incidents, { as:"incidentUsers" });
db.incidents.belongsTo(db.users, {
  foreignKey: "userId",
  as: "userIncidents"
});
// team incident
db.teams.hasMany(db.incidents, { as:"incidentTeams" });
db.incidents.belongsTo(db.teams, {
  foreignKey: "teamId",
  as: "teamIncidents"
});
// user incident teknisi
db.incidents.belongsTo(db.users, {
  foreignKey: "user_technician",
  as: "technicianIncident"
});
// kategori incident
db.categories.hasMany(db.incidents, { as:"incidentCategories" });
db.incidents.belongsTo(db.categories, {
  foreignKey: "categoryId",
  as: "categoryIncidents"
});
// request attachments
db.requests.hasMany(db.requestAttachments, { as:"requestAttachments" });
db.requestAttachments.belongsTo(db.requests, {
  foreignKey: "requestId",
  as: "request"
});
// stage request
db.stages.hasMany(db.requests, { as:"requestStages" });
db.requests.belongsTo(db.stages, {
  foreignKey: "stageId",
  as: "stagesRequests"
});
// user request
db.users.hasMany(db.requests, { as:"requestUsers" });
db.requests.belongsTo(db.users, {
  foreignKey: "userId",
  as: "userRequests"
});
db.requests.hasMany(db.requestDevelopers, { as:"requestDevelopers" });
db.requestDevelopers.belongsTo(db.requests, {
  foreignKey: "requestId",
  as: "developersRequest"
});
db.requestDevelopers.hasOne(db.users, { 
  as:"reqUser",
  foreignKey:"userId"
});
db.users.belongsTo(db.requestDevelopers);

module.exports = db;