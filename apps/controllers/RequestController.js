const { Sequelize } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const sequelize = require('../configs/connection');
const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const db = require('../configs/database');

const dbconfig = require('../configs/db.config');
const { request } = require('http');
const { requestAttachments } = require('../configs/db.config');
const Requests = dbconfig.requests;
const RequestAttachments = dbconfig.RequestAttachments;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;

require('dotenv').config();

exports.create = (res, req) => {
    try{
        const id = uuidv4();
        const title = req.body.title;
        const business_need = req.body.bussiness_need;
        const business_value = req.body.business_value;
        const userId = req.body.user_id;
        const phone = req.body.phone;
        const location = req.body.location;
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        // get data file uploads
        let files = req.files;
        let fileUploads = [];
        files.forEach(element => {
            fileUploads.push({
                filename: element.filename,
                filelocation:element.destination,
                alias:element.originalname,
                createdAt:createdAt,
                updatedAt:updatedAt
            });
        });
        // insert data
        Requests.create({
            id:id,
            title:title,
            business_need:business_need,
            business_value:business_value,
            userId:userId,
            phone:phone,
            location:location,
            createdAt:createdAt,
            updatedAt:updatedAt,
            requestAttachments: fileUploads
        },{
            include: [
                {
                    model: RequestAttachments,
                    as: "requestAttachments"
                }
            ]
        })
        .then(data => {
            // if data inserted
            res.json({"message":"Success"});
            res.end();
        })
        .catch(err => {
            // if error
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });     
    } catch(err) {
        res.status(500).json({
            message:`Error ocurred: ${err}`
        })
    }
}

exports.updateAttachment = (req, res) => {
    try{
        const attachmentId = request.params.id;
        const fileName = req.files.filename;
        const fileLocation = req.files.destination
        const alias = req.files.originalname;
        // insert
        requestAttachments.update({
            filename:fileName,
            filelocation:fileLocation,
            alias:alias
        }, {
            where: {
                id:attachmentId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Updated"
            });
        })
        .catch(err => {
            res.status(500).json({
                "message":`Error occured: ${err}`
            });
        })
    } catch(err) {
        res.status(500).json({
            message: `Error occured: ${err}`
        });
    }
}

exports.updateRequest = (req, res) => {
    try{
        const requestId = req.params.id;
        const title = req.body.title;
        const business_need = req.body.bussiness_need;
        const business_value = req.body.business_value;
        const userId = req.body.user_id;
        const phone = req.body.phone;
        const location = req.body.location;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        Requests.update({
            title:title,
            business_need:business_need,
            business_value:business_value,
            userId:userId,
            phone:phone,
            location:location,
            updatedAt:updatedAt
        },{
            where: {
                id:requestId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Request updated"
            })
        })
        .catch(err => {
            res.status(500).json({
                "message":`Something error ${err}`
            });
        })
    } catch(error) {
        res.json(500).json({
            message:`Error ocurred ${error}`
        });
    }
}

exports.startProject = (req, res) => {
    try {
        const requestId = req.params.id;
        const psd = req.body.psd;
        const ped = req.body.ped; 
        const stageId = req.body.stage_id;

        Requests.update({
            stageId:stageId,
            plan_start_date:psd,
            plan_end_date:ped
        }, {
            where: {
                id:requestId
            }
        })
        .then(data => {
            res.status(200).json({
                message: "Success"
            })
        })
        .catch(err => {
            res.json({
                message: `Error something ${err}`
            })
        })
    } catch(err) {
        res.status(500).json({
            message:`Error occured ${err}`
        })
    }    
}

exports.resolveRequest = (req, res) => {
    const requestId = req.params.id;
    const stageId = req.body.stageId;

    try{
        Request.update({
            stageId:stageId
        }, {
            where: {
                id:requestId            
            }
        })
        .then(data => {
            res.status(200).json({
                message:`Success`
            })
        })
        .catch(err => {
            res.json({
                message:`Error something ${err}`
            })
        })
    } catch(err) {
        res.json({
            message: `Error ocurred ${err}`
        })
    }
}