const { Sequelize } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const sequelize = require('../configs/connection');
const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const db = require('../configs/database');

const dbconfig = require('../configs/db.config');
const { request } = require('http');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;

require('dotenv').config();

exports.create = (res, req) => {
    try{
        const 
    } catch(err) {

    }
}