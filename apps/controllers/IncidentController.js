const { Sequelize } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const sequelize = require('../configs/connection');
const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const { validationResult } = require('express-validator');
const db = require('../configs/database');

const dbconfig = require('../configs/db.config');
const { request } = require('http');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;

const storage = require('../middlewares/upload');
const User = require('../models/User');
const { format } = require('../configs/database');
const { incidentAttachments } = require('../configs/db.config');
const upload = multer({ 
    fileFilter: function (req, file, cb) {   
        let mimetype = file.mimetype;
        errorMessage = [];
        if(req.body.text === ""){
            errorMessage.push({"text":"Tidak boleh kosong"})
        }
        if(req.body.location === ""){
            errorMessage.push({"location":"Tidak boleh kosong"})
        }
        if(errorMessage.length > 0){
            cb(new multer.MulterError(errorMessage));
        }else if(mimetype === "image/jpeg"){
            return cb(null,true);
        } else {
            cb(new multer.MulterError('extension not valid'));
        }
    },
    storage:storage }).array('file');

require('dotenv').config();


/**
 * menampilkan incident
 * @param {*} req 
 * @param {*} res 
 */
exports.viewIncidents = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Incidents.findAll({ 
            include: [
                {
                    model: IncidentAttachments,
                    as: "incidentAttachments"
                },
                { 
                    model: Stages,
                    as: "stageIncidents" 
                },
                {
                    model: Users,
                    as: "userIncidents",
                    attributes:["id","name"]
                },
                {
                    model: Users,
                    as: "technicianIncident"
                },
                {
                    model: Teams,
                    as: "teamIncidents"
                },
                {
                    model: Categories,
                    as: "categoryIncidents",
                    attributes: ["id","name"]
                }
            ],
            where: condition 
        })
        .then(data => {
            res.json({
                "message":"Success",
                "data":data
            });
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });
}

/**
 * menampilkan incident per id
 * @param {*} req 
 * @param {*} res 
 */
exports.viewIncident = (req, res) => {
    try{
        const id = req.params.id;
        Incidents.findOne({ where: {id:id },
            include: [
                { 
                    model: IncidentAttachments,
                    as: "incidentAttachments",
                    attributes:["id","filename","filelocation","alias","incidentId"]
                },
                { 
                    model: Stages,
                    as: "stageIncidents",
                    attributes:["id","text","description"]
                },
                {
                    model: Users,
                    as: "userIncidents",
                    attributes:["id","name"]
                },
                {
                    model: Users,
                    as: "technicianIncident",
                    attributes: ["name","username"]
                },
                {
                    model: Teams,
                    as: "teamIncidents"
                },
                {
                    model: Categories,
                    as: "categoryIncidents",
                    attributes: ["id","name"]
                }
            ] 
        })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });
    }catch(err){
        res.json({
            "message":"Error",
            "error":err
        }); 
        res.end();
    }
}

/**
 * input incident
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createIncident = (req, res) => {
    try {        
        upload(req, res, (err) => {            
            if(err instanceof multer.MulterError) {
                res.json({message:err})
            }else{
                 // inisiasi variabel
                let text = req.body.text;
                let location = req.body.location;
                let phone = req.body.phone;
                let user_id = req.body.user;
                let stage_id = req.body.stage_id;
                let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                
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
                // unique id with uuid
                let idIndicent = uuidv4(); 
                // insert data
                Incidents.create({
                    id:idIndicent,
                    text:text,
                    location:location,
                    phone:phone,
                    userId:user_id,
                    stageId:stage_id,
                    createdAt:createdAt,
                    updatedAt:updatedAt,
                    incidentAttachments: fileUploads
                },{
                    include: [
                        {
                            model: IncidentAttachments,
                            as: "incidentAttachments"
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
            }
        })      
       
    } catch(err) {
        // if error
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

/**
 * update data incident
 * @param {*} req 
 * @param {*} res 
 */
exports.updateIncident = (req, res) => {
    // inisiasi variabel
    const incidentId = req.params.id;
    let text = req.body.text;
    let location = req.body.location;
    let phone = req.body.phone;
    let user_id = req.body.user;
    let stage_id = req.body.stage_id;
    let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    try{
        // update incident
        Incident.update({
            text:text,
            location:location,
            phone:phone,
            userId:user_id,
            stageId:stage_id,
            updatedAt:updatedAt
        }, {
            where: {
                id:incidentId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Updated"
            });
        })
        .catch(err => {
            res.status(500).json({
                message:`Error occured: ${err}`
            })
        })
    } catch(err) {
        res.status(500).json({
            message: `Error occured: ${err}`
        });
    }
}

/**
 * input ticket
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.inputTikcet = async (req, res) => {
    try {
        /*-- validation --*/
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                'message':'Error',
                'send':req.body,
                'data':[],
                'errors': errors.array(), 
            });
        }
        /*-- end validation --*/
         
        // initiate variable
        let incidentId = req.params.id;
        let teamId = req.body.team_id;
        let ticket = req.body.ticket;
        let categoryId = req.body.category_id;
        let stageId = req.body.stage_id;
        let validation = [];

        // create message validation
        let datateam;
        const validasi_team = { "team": 'Team tidak ditemukan' };
        const validasi_category = { "category": 'Kategori tidak ditemukan' };
        // get data team valid in database

        // category
        const category = await Categories.findOne({ where: { id:categoryId } })
        .then(result => {
            return result;
        });
        
        const team = Teams.findOne({ where: { id:teamId } })
        .then(result => {
            return result;
        });

        // validation data
        if(team === null){
            validation.push(validasi_team);
        }
        if(category === null){
            validation.push(validasi_category);
        }

        if(validation.length > 0){
            res.status(404).json({
                "error":validation
            })
        }else{
            let dateNow = moment();
            const sdate = dateNow.format('YYYY-MM-DD');
            const stime = dateNow.format('HH:mm:ss');
            let endDay = dateNow.clone();
            endDay = endDay.add(category.time_interval, 'hours');
            const edate = endDay.format('YYYY-MM-DD');
            const etime = endDay.format('HH:mm:ss');
            Incidents.update({
                teamId: teamId,
                ticket: ticket,
                categoryId: categoryId,
                sdate_ticket: sdate,
                stime_ticket: stime,
                edate_ticket: edate,
                etime_ticket: etime,
                stageId: stageId
            }, {
                where: {
                    id:incidentId
                }
            })
            .then(data => {
                res.status(200).json({
                    "message":"Success"
                });
                res.end();
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error occured: ${err}`,
                });
            });
        }
    } catch(err) {
        res.status(500).json({
            message: `Error occured: ${err}`,
        });
    }
}

/**
 * resolve incident apabila sudah selesai dikerjakan
 * @param {*} req 
 * @param {*} res 
 */
exports.resolve = (req, res) => {
    try {
        // initiate variable
        let incidentId = req.params.id;
        let resolveText = req.body.resolve_text;
        let dateNow = moment();
        let resolveDate = dateNow.format('YYYY-MM-DD');
        let resolveTime = dateNow.format('HH:mm:ss');
        let teknisi = req.body.teknisi;
        let stageId = req.body.stage_id;

        // update data
        Incidents.update({
           resolve_text:resolveText,
           resolve_date:resolveDate,
           resolve_time:resolveTime,
           user_technician:teknisi,
           stageId:stageId
        }, {
            where: {
                id:incidentId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Resolved"
            });
            res.end();
        })
        .catch(err => {
            res.status(500).json({
                message: `Error occured: ${err}`,
            });
        });
    } catch(err) {
        res.status(500).json({
            message: `Error occured: ${err}`,
        });
    }
}

/**
 * menutup incident
 * @param {*} req 
 * @param {*} res 
 */
exports.close = async (req, res) => {
    try {
        // initiate variable
        let incidentId = req.params.id;
        let stageId = req.body.stage_id;

        const incident = await Incidents.findByPk(incidentId)
        .then(result => {
            return result;
        });
        
        const dateNow = moment();
        const date = dateNow.format('YYYY-MM-DD');
        const time = dateNow.format('HH:mm:ss');
        const sdate = incident.sdate_ticket;
        const stime = incident.stime_ticket;
        const rdate = incident.resolve_date;
        const rtime = incident.resolve_time;
        const startDate = moment(sdate+' '+stime);
        const resolveDate = moment(rdate+' '+rtime);
        var intervalTime = resolveDate.diff(startDate, 'minutes');

        // update data
        Incidents.update({
           stageId:stageId,
           interval_resolve:intervalTime,
           close_date:date,
           close_time:time
        }, {
            where: {
                id:incidentId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Close"
            });
            res.end();
        })
        .catch(err => {
            res.status(500).json({
                message: `Error occured: ${err}`,
            });
        });
    } catch(err) {
        res.status(500).json({
            message: `Error occured: ${err}`,
        });
    }
}


/**
 * update attachment
 * @param {*} req 
 * @param {*} res 
 */
exports.updateAttachment = (req, res) => {
    try {
        upload(req, res, async (err) => {            
            if(err instanceof multer.MulterError) {
                res.json({message:err})
            }else{
                // parameter id
                const attachmentId = req.params.id;
                // upload files
                let files = req.files;
                let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
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
                // get data attachment
                const attachments = await IncidentAttachments.findByPk(attachmentId)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    res.status(500).json({
                        message: `Error occured: ${err}`
                    });
                });
                // delete file
                const pathDelete = attachments.filelocation;
                const fileNameOld = attachments.filename;
                const fileOld = pathDelete+'/'+fileNameOld;
                fs.unlink(fileOld, (err) => {
                    if(err){
                        return
                    }
                });
                // update file attachment
                IncidentAttachments.update({
                    filename:fileUploads[0].filename,
                    filelocation:fileUploads[0].filelocation,
                    alias:fileUploads[0].alias
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
            }
        })
    } catch(err) {
        res.status(500).json({
            message: `Error occured: ${err}`
        });
    }
}

/**
 * delete attachment
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteAttachment = async (req, res) => {
    try {
        const attachmentId = req.params.id;
        const attachment = incidentAttachments.findByPk(attachmentId)
        .then(data => {
            return data;
        });
        const filename = attachment.filename;
        const filelocation = attachment.filelocation;
        const fileDelete = filelocation+'/'+filename;
        fs.unlink(fileDelete, (err) => {
            if(err){
                return
            }
        });
        IncidentAttachments.destroy({
            where: {
                id:attachmentId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                message: `Error occured: ${err}`
            });
        })
    } catch(err) {
        res.status(500).json({
            message: `Error  occured: ${error}`
        });
    }
}
