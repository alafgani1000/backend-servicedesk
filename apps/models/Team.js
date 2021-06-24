const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Team = sequelize.define('teams', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = Team;