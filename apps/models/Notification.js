const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Notification = sequelize.define('notifications', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    tableName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from: {
        type: DataTypes.STRING,
        allowNull:false
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idData: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Notification;