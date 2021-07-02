const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const IncidentAattachments = sequelize.define('incident_attachments', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    filename: {
        type:DataTypes.TEXT,
        allowNull:false
    },
    filelocation: {
        type:DataTypes.TEXT,
        allowNull: false
    },
    alias: {
        type:DataTypes.STRING,
        allowNull:  false
    },
    incidentId: {
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = IncidentAattachments;