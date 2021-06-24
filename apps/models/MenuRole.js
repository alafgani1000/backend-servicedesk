const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection'); 

const MenuRole = sequelize.define('menu_roles', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false
    },
    menu_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
});

module.exports = MenuRole