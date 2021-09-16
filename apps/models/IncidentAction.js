const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const IncidentAction = sequelize.define('incident_actions', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    idData: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idAction: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = IncidentAction;