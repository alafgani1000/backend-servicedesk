const multer = require('multer');
const fs = require('fs');
const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const { validationResult } = require('express-validator');
const dbconfig = require('../configs/db.config');
const Requests = dbconfig.requests;
const RequestAttachments = dbconfig.requestAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;

const storage = require('../middlewares/upload');
const { stages } = require('../configs/db.config');
const User = require('../models/User');

const upload = multer({ 
    fileFilter: function (req, file, cb) {   
        let mimetype = file.mimetype;
        errorMessage = [];
        if(req.body.title === ""){
            errorMessage.push({"title":"Tidak boleh kosong"})
        }
        if(req.body.business_need === ""){
            errorMessage.push({"business_need":"Tidak boleh kosong"})
        }
        if(req.body.business_value === ""){
            errorMessage.push({"business_value":"Tidak boleh kosong"})
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
 * menampilkan request
 * @param {*} req 
 * @param {*} res 
 */
 exports.viewRequests = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Requests.findAll({ 
            include: [
                {
                    model: RequestAttachments,
                    as: "requestAttachments"
                },
                {
                    model: Stages,
                    as: "stagesRequests",
                    attributes: ["text","description"]
                },
                {
                    model: Users,
                    as: "userRequests",
                    attributes: ["name"]
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
exports.viewRequest = (req, res) => {
    try{
        const id = req.params.id;
        Requests.findOne({ where: {id:id },
            include: [
                {
                    model: RequestAttachments,
                    as: "requestAttachments"
                },
                {
                    model: Stages,
                    as: "stagesRequests",
                    attributes: ["text","description"]
                },
                {
                    model: Users,
                    as: "userRequests",
                    attributes: ["name"]
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
 * 
 * @param {*} req 
 * @param {*} res
 *  
 */
 exports.updateRequest = (req, res) => {
    // inisiasi variabel
    const requestId = req.params.id;
    const title = req.body.title;
    const businessNeed = req.body.business_need;
    const businessValue = req.body.business_value;
    const location = req.body.location;
    const phone = req.body.phone;
    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    try{
        // update request
        Requests.update({
            title:title,
            business_need:businessNeed,
            business:businessValue,
            location:location,
            phone:phone,
            updatedAt:updatedAt
        }, {
            where: {
                id:requestId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Request Updated"
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
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
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
                const attachments = await RequestAttachments.findByPk(attachmentId)
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
                RequestAttachments.update({
                    file_name:fileUploads[0].filename,
                    file_location:fileUploads[0].filelocation,
                    alias:fileUploads[0].alias
                }, {
                    where: {
                        id:attachmentId
                    }
                })
                .then(data => {
                    res.status(200).json({
                        "message":"Attachment Updated"
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
 * input request
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 exports.createRequest = (req, res) => {
    try {        
        upload(req, res, (err) => {            
            if(err instanceof multer.MulterError) {
                res.json({message:err})
            }else{
                 // inisiasi variabel
                let title = req.body.title;
                let business_need = req.body.business_need;
                let business_value = req.body.business_value;
                let user_id = req.body.user_id;
                let phone = req.body.phone;
                let location = req.body.location;
                let stage_id = req.body.stage_id;
                let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                
                // get data file uploads
                let files = req.files;
                let fileUploads = [];
                files.forEach(element => {
                    fileUploads.push({
                        file_name: element.filename,
                        file_location:element.destination,
                        alias:element.originalname,
                        createdAt:createdAt,
                        updatedAt:updatedAt
                    });
                });
                // unique id with uuid
                let requestId = uuidv4(); 
                // insert data
                Requests.create({
                    id:requestId,
                    title:title,
                    business_need:business_need,
                    business_value:business_value,
                    location:location,
                    phone:phone,
                    userId:user_id,
                    stageId:stage_id,
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
 * permintaan disetujui dan waktu pengerjaannya sudah ditentukan
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.openRequest = (req, res) => {
    try {
        // initiate variable
        const requestId = req.params.id;
        const startDate = req.body.start_date;
        const startTime = req.body.start_time;
        const endDate = req.body.end_date;
        const endTime = req.body.end_time;
        const stageId = req.body.stage_id;

        // update data
        Requests.update({
           start_date:startDate,
           start_time:startTime,
           end_date:endDate,
           end_time:endTime,
           stageId:stageId
        }, {
            where: {
                id:requestId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Request open, permintaan pemnbuatan aplikasi telah di setejui"
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
 * pengerjaan telah diselesaikan oleh departemen it
 * @param {*} req
 * @param {*} res
 */
exports.resolveRequest = (req, res) => {
    try {
        // initiate variable
        const requestId = req.params.id;
        const stageId = req.body.stage_id;
        const resolveDate = req.body.resolve_date;
        const resolveTime = req.body.resolve_time;
    
        // update data
        Requests.update({
           stageId:stageId,
           resolve_date:resolveDate,
           resolve_time:resolveTime,
        }, {
            where: {
                id:requestId
            }
        })
        .then(data => {
            res.status(200).json({
                "message":"Request Resolved"
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
 * close, aplikasi telah di approve oleh user
 * @param {*} req
 * @param {*} res
 */
exports.closeRequest = (req, res) => {
    try{
        const requestId = req.params.id;
        const stageId = req.body.stage_id;
        const closeDate = req.body.close_date;
        const closeTime = req.body.close_time;

        Requests.update({
            stageId:stageId,
            close_date:closeDate,
            close_time:closeTime
        }, {
           where: {
                id:requestId
           } 
        })
        .then(err => {
            res.status(200).json({
                message:`Request Closed`
            });
            res.end();
        })
        .catch(err => {
            res.status(500).json({
                message: `Error occured: ${err}`,
            });
        })
    }catch(err){
        res.status(500).json({
            message: `Error occured: ${err}`,
        });
    }
}
