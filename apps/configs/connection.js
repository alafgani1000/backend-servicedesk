const { Sequelize } =  require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, 'agan', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
})

module.exports = sequelize;