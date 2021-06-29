const  { Sequelize } = require('sequelize');

const path = 'mysql://root:agan@localhost:3306/servicedesk';
const sequelize = new Sequelize(path);

module.exports = sequelize;