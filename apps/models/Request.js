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
    user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(14),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    stage_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    plan_start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    plan_end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    resolve_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Request;