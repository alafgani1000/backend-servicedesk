const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Action = sequelize.define('actions', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Action;