const { Sequelize } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const sequelize = require('../configs/connection');
const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const db = require('../configs/database');

const dbconfig = require('../configs/db.config');
const Incident = dbconfig.incident;
const IncidentAttachmens = dbconfig.incidentAttachments;


require('dotenv').config();

exports.viewIncidents = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Incident.findAll({ where: condition })
        .then(data => {
            res.json({
                'message':'Success',
                'data':data
            });
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });
}

exports.viewIncident = (req, res) => {
    try{
        Incident.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });
    }catch(err){
        res.json({
            'message':'Error',
            'data':result,
            'error':eror
        }); 
        res.end();
    }
}

exports.createIncident = (req, res) => {
    try {        
        let text = req.body.text;
        let location = req.body.location;
        let phone = req.body.phone;
        let user_id = req.body.user;
        let stage_id = req.body.stage_id;
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let insertStatus = false;
        
        let files = req.files;
        let fileUploads = [];
        files.forEach(element => {
            fileUploads.push({
                'filename': element.filename,
                'filelocation':'upload',
                'alias':element.originalname,
                'createdAt':createdAt,
                'updatedAt':updatedAt
            });
        });
        
        Incident.create({
            id:uuidv4(),
            text:text,
            location:location,
            phone:phone,
            user:user_id,
            stage_id:stage_id,
            createdAt:createdAt,
            updatedAt:updatedAt,
            incidentAttachment: fileUploads
        })
        .then(data => {
            res.send(req.files);
            res.end();
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });    

    } catch(err) {
        console.log(err);

        if(err.code == "LIMIT_FILE_SIZE"){
            return res.status(500).json({
                message: "File size should be les than 5MB",
            });
        }

        res.status(500).json({
            message: `Error occured: ${err}`,
        });
    }
}