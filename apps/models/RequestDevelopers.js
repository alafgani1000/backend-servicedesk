const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const RequestDevelopers = sequelize.define('request_developers', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    requestId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull:false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = RequestDevelopers;