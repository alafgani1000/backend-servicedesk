const { Sequelize } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const db = require('../configs/database');
const sequelize = require('../configs/connection');
const upload = require('../middlewares/upload');
const Incident = require('../models/Incident');

require('dotenv').config();

exports.viewIncidents = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;


    Incident.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting error"
            });
        });
}

exports.viewIncident = (req, res) => {
    try{
        let idTeam = req.params.id;
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM incidents WHERE id = ?'
            db.query(selectQuery, [idTeam], (error, result, fields) => {
                if(error){
                    res.json({
                        'message':'Error',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }else{
                    if(result.length > 0){
                        res.json({
                            'message':'Success',
                            'data':result,
                            'error':error
                        });
                        res.end();
                    }else{
                        res.json({
                            'message':'Data not found',
                            'data':result,
                            'error':error
                        }); 
                        res.end();
                    }
                }
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

exports.storeIncident = async (req, res) => {
    try {
        await upload(req, res);

        if(req.file == undefined) {
            return res.status(400).send({ message: "Choose a file to upload" });
        }
        
        let text = req.body.text;
        let location = req.body.location;
        let phone = req.body.phone;
        let user_id = '';
        let stage_id = req.body.stage_id;
        let ticket = req.body.ticket;
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let post = {
                text:text,
                location:location,
                phone:phone,
                user_id:user_id,
                stage_id:stage_id,
                ticket:ticket,
                created_at:createdAt,
                updated_at:updatedAt,
            };
            let storeQuery = 'INSERT INTO incidents SET ?'
            db.query(storeQuery, post, (error, result, fields) => {
                if(error){
                    res.json({
                        'message':'Error',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }else{
                   let insertStatus = true;
                }
            });
        });
        if(insertStatus == tue){
            res.json({
                'message':'Success',
            });
            res.end();
        }else{
            res.status(200).json({
                message: "File uploaded successfully: " + req.file.originalname,
            });
        }
      
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