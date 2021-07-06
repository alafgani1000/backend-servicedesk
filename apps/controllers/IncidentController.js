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


/**
 * menampilkan incident
 * @param {*} req 
 * @param {*} res 
 */
exports.viewIncidents = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Incidents.findAll({ where: condition })
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
        Incidents.findAll({ where: condition })
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
            "message":"Error",
            "data":result,
            "error":eror
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
        
        // inisiasi variabel
        let text = req.body.text;
        let location = req.body.location;
        let phone = req.body.phone;
        let user_id = req.body.user;
        let stage_id = req.body.stage_id;
        let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
        let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        let insertStatus = false;
        
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
exports.inputTikcet = (req, res) => {
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
        let incidentId = req.param.id;
        let teamId = req.body.team_id;
        let ticket = req.body.ticket;
        let categoryId = req.body.category_id;
        let stageId = req.body.stage_id;
        let validation = [];

        // create measage validation
        const validasi_team = { team: 'Team tidak ditemukan' };
        const validasi_category = { category: 'Kategori tidak ditemukan' };
        // get data team valid in database
        let team = Teams.findOne({ where: { id:teamId } });
        let category = Categories.findOne({ where: { id:categoryId } });

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
            let dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
            let ticketTime = dateNow.add(Category.time_interval, 'hours');

            Incident.update({
                teamId: teamId,
                ticket: ticket,
                categoryId: categoryId,
                ticket_time: ticketTime,
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
        let resolveText = req.body.reslove_text;
        let resolveDate = req.body.resolve_date;
        let teknisi = req.body.teknisi;
        let stageId = req.body.stage_id;
        // update data
        Incident.update({
           reslove_text:resolveText,
           resolve_date:resolveDate,
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
exports.close = (req, res) => {
    try {
        // initiate variable
        let incidentId = req.params.id;
        let stageId = req.body.stage_id;
        // update data
        Incident.update({
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
 * update attachment
 * @param {*} req 
 * @param {*} res 
 */
exports.updateAttachment = (req, res) => {
    try {
        const attachmentId = request.params.id;
        const fileName = req.files.filename;
        const fileLocation = req.files.destination
        const alias = req.files.originalname;
        IncidentAattachments.update({
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

/**
 * delete attachment
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteAttachment = (req, res) => {
    const attachmentId = req.params.id;
    try {
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
