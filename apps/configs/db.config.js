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

// user
db.roles.hasMany(db.users, {as:"rolesUsers", foreignKey:"level"});
db.users.belongsTo(db.roles, {
  foreignKey: "level",
  as:"userRole"
})
// incident
db.incidents.hasMany(db.incidentAttachments, { as:"incidentAttachments" });
db.incidentAttachments.belongsTo(db.incidents, {
  foreignKey: "incidentId",
  as: "incidents"
});
db.stages.hasMany(db.incidents, { as:"incidentStages"});
db.incidents.belongsTo(db.stages, {
  foreignKey: "stageId",
  as: "stageIncidents"
});
db.users.hasMany(db.incidents, { as:"incidentUsers" });
db.incidents.belongsTo(db.users, {
  foreignKey: "userId",
  as: "userIncidents"
})
db.teams.hasMany(db.incidents, { as:"incidentTeams" });
db.incidents.belongsTo(db.teams, {
  foreignKey: "teamId",
  as: "teamIncidents"
});
db.incidents.belongsTo(db.users, {
  foreignKey: "user_technician",
  as: "technicianIncident"
})
db.categories.hasMany(db.incidents, { as:"incidentCategories" });
db.incidents.belongsTo(db.categories, {
  foreignKey: "categoryId",
  as: "categoryIncidents"
})

// request
db.requests.hasMany(db.requestAttachments, { as:"requestAttachments" });
db.requestAttachments.belongsTo(db.requests, {
  foreignKey: "requestId",
  as: "request"
});
db.stages.hasMany(db.requests, { as:"requestStages" });
db.requests.belongsTo(db.stages, {
  foreignKey: "stageId",
  as: "stagesRequests"
});
db.users.hasMany(db.requests, { as:"requestUsers" });
db.requests.belongsTo(db.users, {
  foreignKey: "userId",
  as: "userRequests"
})
module.exports = db;