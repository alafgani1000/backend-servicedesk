const sequelize = require('../apps/configs/connection');
const Team = require('../apps/models/Team');
const Incident = require('../apps/models/Incident');
const IncidentAattachments = require('../apps/models/IncidentAttachments');
const Category = require('../apps/models/Category');
const Menu = require('../apps/models/Menu');
const MenuRole = require('../apps/models/MenuRole');
const Request = require('../apps/models/Request');
const RequestAttachment = require('../apps/models/RequestAttachment');
const Role = require('../apps/models/Role');
const Stage = require('../apps/models/Stage');
const User = require('../apps/models/User');
const UserTeam = require('../apps/models/UserTeams');
// sequelize.sync();

// Incident.sync();
// IncidentAattachments.sync();
// Category.sync();
// Menu.sync();
// MenuRole.sync();
Request.sync();
// RequestAttachment.sync();
// Role.sync();
// Stage.sync();
// User.sync();
// UserTeam.sync();
// DefaultRoleValue.role();

