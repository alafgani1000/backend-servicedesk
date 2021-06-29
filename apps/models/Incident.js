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
    user_id: {   
        type:DataTypes.INTEGER
    },
    stage_id: {
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
        type:DataTypes.DATE
    },
    team_id: {
        type:DataTypes.INTEGER,
        allowNull:true
    },
    user_technician: {
        type:DataTypes.STRING
    },
    category_id: {
        type:DataTypes.INTEGER(2)
    },
    ticket_time: {
        type:DataTypes.DATE
    }
})

module.exports = Incident;