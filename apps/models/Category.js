const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Category = sequelize.define('categories', {
    id: {
        types: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    time_interval: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Category;