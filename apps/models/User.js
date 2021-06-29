const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    groupuser: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    token: {
        type: DataTypes.STRING(255)
    }
});

module.exports = User;