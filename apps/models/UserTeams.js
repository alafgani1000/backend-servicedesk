const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const UserTeam =  sequelize.define('user_teams', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    team_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
});

module.exports = UserTeam;