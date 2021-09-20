const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const moment = require('moment');
const dbconfig = require('../configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;
const Notifications = dbconfig.notifications;

exports.incidentNotifications = async (req, res) => {
    try {
        let messageData = {
            message:'',
            data:''
        }
        const notifications = await Notifications.findAll({ 
            where:{
                tableName:'incidents',
                status:0,
                to:idLogin
            }
        })
        .then(result => {
            messageData = {
                message:'success',
                data:result
            }
        })
        .catch(error => {
            messageData = {
                message:'error',
                data:error
            }
        })
        if(messageData.message === 'success'){
            res.status(200).json({
                message:'Success',
                data:messageData.data
            })
        }else if(messageData.message === 'error'){
            res.status(500).json({
                message:'Error',
                data:messageData.data
            })
        }        
    } catch(error) {
        res.status(500).json({
            message:error
        });
    }
}

exports.readNotification = async (req, res) => {
    try {
        const idNotif = req.params.id;
        let dataMessage = {
            "message":"",
            "data":""
        }
        const notification = await Notifications.update({
            status:1
        },{
            where:{
                id:idNotif
            }
        })
        .then(result => {
            dataMessage = {
                "message":"success",
                "data":result
            }
        })
        .catch(error => {
            dataMessage = {
                "message":"error",
                "data":error
            }
        })

        if(dataMessage.message === 'success'){
            res.status(200).json({
                "message":"Success"
            })
        }else if(dataMessage === 'error'){
            res.json(500).json({
                "message":"Error " + dataMessage.error
            })
        }
    } catch(err) {
        res.status(500).json({
            "message":"Error " + err 
        })
    }

}