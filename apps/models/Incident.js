const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Incident = sequelize.define('incidents', {
    id: {
        type: DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    text: {
        type:DataTypes.TEXT,
        allowNull:false
    },
    location: {
        type:DataTypes.STRING(100),
        allowNull:true
    },
    phone: {
        type:DataTypes.STRING(14),
        allowNull:true
    },
    userId: {   
        type:DataTypes.INTEGER
    },
    stageId: {
        type:DataTypes.INTEGER,
        allowNull:true
    },
    resolve_text: {
        type:DataTypes.STRING,
        allowNull:true
    },
    ticket: {
        type:DataTypes.STRING(20),
        allowNull:true
    },
    resolve_date: {
        type:DataTypes.DATEONLY
    },
    resolve_time: {
        type:DataTypes.TIME
    },
    teamId: {
        type:DataTypes.INTEGER,
        allowNull:true
    },
    user_technician: {
        type:DataTypes.STRING
    },
    categoryId: {
        type:DataTypes.INTEGER(2)
    },
    sdate_ticket: {
        type:DataTypes.DATEONLY
    },
    stime_ticket: {
        type:DataTypes.TIME
    },
    edate_ticket: {
        type:DataTypes.DATEONLY
    },
    etime_ticket: {
        type:DataTypes.TIME
        
    },
    close_date: {
        type:DataTypes.DATEONLY
    },
    close_time: {
        type:DataTypes.TIME
    },
    interval_resolve: {
        type:DataTypes.INTEGER
    }
})

module.exports = Incident;