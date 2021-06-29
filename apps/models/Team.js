const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Team = sequelize.define('teams', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Team;