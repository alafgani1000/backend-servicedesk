const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const RequestAttachment = sequelize.define('request_attachments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requestId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = RequestAttachment;