const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Request = sequelize.define('requests', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    business_need: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    business_value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(14),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    stageId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    resolve_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    resolve_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    close_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    close_time: {
        type: DataTypes.TIME,
        allowNull: true
    }
});

module.exports = Request;