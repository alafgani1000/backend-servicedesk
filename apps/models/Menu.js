const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Menu = sequelize.define('menus', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false
    },
    kode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    description: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
});

module.exports = Menu;