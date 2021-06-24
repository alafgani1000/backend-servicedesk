const { Sequelize, DataTypes } =  require('sequelize');
const sequelize = require('../configs/connection');

const Stage = sequelize.define('stages', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Stage;