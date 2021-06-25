const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
});

module.exports = Role;