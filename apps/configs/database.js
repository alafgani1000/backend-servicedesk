var mysql = require('mysql');
require('dotenv').config();
var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASWORD,
  database: process.env.DB_DATABASE
});

module.exports = db;