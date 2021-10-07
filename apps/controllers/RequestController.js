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
const Notifications = dbconfig.notifications;
const Users = dbconfig.users;
const RequestDevelopers = dbconfig.requestDevelopers;

const storage = require('../middlewares/upload');
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
        }else if(mimetype === "image/jpeg" || mimetype === "image/png"){
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
                },
                {
                    model: RequestDevelopers,
                    as: "requestDevelopers",
                    include: [
                        {
                            model: Users,
                            as: 'userDev',
                            attributes: ["id","username","name"]
                        }
                    ]
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
                },
                {
                    model: RequestDevelopers,
                    as: "requestDevelopers",
                    include: [
                        {
                            model: Users,
                            as: "userDev",
                            attributes: ["id","username","name"]
                        }

                    ]
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
exports.updateRequest = async (req, res) => {
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
        const updateRequest = await Requests.update({
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
                "status":"success",
                "message":"Request Updated"
            });
        })
        .catch(err => {
            res.status(500).json({
                "status":"error",
                "message":`Error occured: ${err}`
            })
        })
    } catch(err) {
        res.status(500).json({
            "status":"error",
            "message": `Error occured: ${err}`
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
        upload(req, res, async (err) => {            
            if(err instanceof multer.MulterError) {
                res.json({message:err})
            }else{
                 // inisiasi variabel
                let title = req.body.title;
                let business_need = req.body.business_need;
                let business_value = req.body.business_value;
                let user_id = idLogin;
                let phone = req.body.phone;
                let location = req.body.location;
                let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let messageData = {
                    "message": "",
                    "data": ""
                }

                // get stage new
                const stageNew = await Stages.findOne({ where:{text:'New'} })
                .then(result => {
                    return result;
                })
                let stageId = stageNew.id
                
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
                const createRequest = await Requests.create({
                    id:requestId,
                    title:title,
                    business_need:business_need,
                    business_value:business_value,
                    location:location,
                    phone:phone,
                    userId:user_id,
                    stageId:stageId,
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
                    messageData = {
                        "message":"success",
                        "data": data
                    }
                })
                .catch(err => {
                    // if error
                    messageData = {
                        "message":"error",
                        "data":err
                    }
                });   

                if(messageData.message === 'success'){
                    // get data request
                    const getRequest = await Requests.findOne({ where:{id:requestId}} )
                    .then(result => {
                        return result
                    })
                    // get data user to
                    const userFrom = await Users.findOne({ where:{id:getRequest.userId}} )
                    .then(result => {
                        return result;
                    })
                    // get data user from
                    const userTo = await Users.findOne({ where:{level:1} })
                    .then(result => {
                        return result;
                    })
                    const notifId = uuidv4();
                    const notifData = {
                        "text":getRequest.title
                    }

                    const createNotif = await Notifications.create({
                        id:notifId,
                        tableName:'requests',
                        from:userFrom.name,
                        to:userTo.id,
                        idData:getRequest.id,
                        data:JSON.stringify(notifData),
                        stage:stageNew.text,
                        status:0
                    })
                    .then(result => {
                        return result;
                    })         
                    // if data inserted
                    res.json({
                        "message":"Success",
                        "data":notifId
                    });
                    res.end();
                }else if(messageData.message === 'error'){
                    //if error
                    res.status(500).send({
                        message:messageData.message  || "Error someting"
                    });
                }
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
 * membuat nomor ticket request
 * @param {code}
 * @return {ticket}
 */
 const genNumberTicket = (code) => {
    // create ticket number
    const phrase = 'I';
    var jumlahDigit = 7;
    var codeString = `${code}`;
    var jumlahRequest = codeString.length;
    var selisih = jumlahDigit - jumlahRequest;
    var zeroCount = '0000000';
    var jumlahNol = zeroCount.substr(1, selisih);
    var ticket = phrase+jumlahNol+code;
    return ticket;
}


/**
 * permintaan disetujui dan waktu pengerjaannya sudah ditentukan
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.openRequest = async (req, res) => {
    try {
        // initiate variable
        const requestId = req.params.id;
        const startDate = req.body.start_date;
        const startTime = req.body.start_time;
        const endDate = req.body.end_date;
        const endTime = req.body.end_time;
        const developers = req.body.developers;
        let messageData = {

        }
        // get data request
        const requestData = await Requests.findOne({ where: {id:requestId}} )
        .then(result => {
            return result;
        })
        // get stage open
        const stageOpen = await Stages.findOne({ where:{text:'Open'}} )
        .then(result => {
            return result;
        })
        const stageId = stageOpen.id;
        const ticket = genNumberTicket(requestData.code);

        // update data
       const update = await Requests.update({
           start_date:startDate,
           start_time:startTime,
           end_date:endDate,
           end_time:endTime,
           stageId:stageId,
           ticket:ticket
        }, {
            where: {
                id:requestId
            }
        })
        .then(data => {
            messageData = {
                "status":"success",
                "ticket":ticket,
                "message":"Request open, permintaan pembuatan aplikasi telah disetujui"
            }
        })
        .catch(err => {
            messageData = {
                "status":"error",
                "message":`Error occured: ${err}`
            }
        });

        // input developers
        developers.forEach((item, index) => {
            const devId = uuidv4()
            const developers = RequestDevelopers.create({
                id:devId,
                requestId:requestId,
                userId:item.value
            })
        });
      
        if(messageData.status === "success"){
            // get data request
            const getRequest = await Requests.findOne({ where:{id:requestId}} )
            .then(result => {
                return result
            })
            // get data user to
            const userTo = await Users.findOne({ where:{id:getRequest.userId}} )
            .then(result => {
                return result;
            })
            // get data user from
            const userFrom = await Users.findOne({ where:{id:idLogin} })
            .then(result => {
                return result;
            })
            const notifId = uuidv4();
            const notifData = {
                "text":getRequest.title
            }
            
            const createNotif = await Notifications.create({
                id:notifId,
                tableName:'requests',
                from:userFrom.name,
                to:userTo.id,
                idData:getRequest.id,
                data:JSON.stringify(notifData),
                stage:stageOpen.text,
                status:0
            })
            .then(result => {
                return result;
            })         

            res.status(200).json({
                "status":"success",
                "ticket":ticket,
                "data":getRequest,
                "message":"Request open, permintaan pembuatan aplikasi telah di setejui",
                "notifId":notifId
            });
            res.end();
        }else if(messageData.status === "error"){
            res.status(500).json({
                "status":"error",
                "message": `Error occured: ${err}`,
            });
            res.end();
        }
    } catch(err) {
        res.status(500).json({
            status:"error",
            message: `Error occured: ${err}`,
        });
    }
}

/**
 * pengerjaan telah diselesaikan oleh departemen it
 * @param {*} req
 * @param {*} res
 */
exports.resolveRequest = async (req, res) => {
    try {
        // initiate variable
        let dateNow = moment();
        const sdate = dateNow.format('YYYY-MM-DD');
        const stime = dateNow.format('HH:mm:ss');
        const requestId = req.params.id;
        const resolveDate = sdate;
        const resolveTime = stime;
        let messageData = {}

        // resolve stage
        const stageResolve = await Stages.findOne({ where:{text:'Resolve'} })
        .then(result => {
            return result;
        })
    
        // update data
        const resolve = await Requests.update({
           stageId:stageResolve.id,
           resolve_date:resolveDate,
           resolve_time:resolveTime,
        }, {
            where: {
                id:requestId
            }
        })
        .then(data => {
            messageData = {
                "status":"success"
            }
        })
        .catch(err => {
            messageData = {
                "status":"error",
                "data":err
            }
        });

        if (messageData.status === "success") {
            const getRequest = await Requests.findOne({ where:{id:requestId}} )
            .then(result => {
                return result
            })

            // get data user to
            const userTo = await Users.findOne({ where:{id:getRequest.userId}} )
            .then(result => {
                return result;
            })

            // get data user from
            const userFrom = await Users.findOne({ where:{id:idLogin} })
            .then(result => {
                return result;
            })

            const notifId = uuidv4();
            const notifData = {
                "text":getRequest.title
            }

            // create notifikasi
            const createNotif = await Notifications.create({
                id:notifId,
                tableName:'requests',
                from:userFrom.name,
                to:userTo.id,
                idData:getRequest.id,
                data:JSON.stringify(notifData),
                stage:stageResolve.text,
                status:0
            })
            .then(result => {
                return result;
            })     

            // response success
            res.status(200).json({
                "status":"success",
                "message":"Resolved",
                "notifId":notifId
            })
        } else if (messageData.status === "error") {
            // response fail
            res.status(500).json({
                "status":"error",
                "message":"Resolve Failed",
            })
        }
    } catch(err) {
        res.status(500).json({
            "status":"error",
            "message": `Error occured: ${err}`,
        });
    }
}

/**
 * close, aplikasi telah di approve oleh user
 * @param {*} req
 * @param {*} res
 */
exports.closeRequest = async (req, res) => {
    try{
        const requestId = req.params.id;
        let dateNow = moment();
        const cdate = dateNow.format('YYYY-MM-DD');
        const ctime = dateNow.format('HH:mm:ss');
        const closeDate = cdate;
        const closeTime = ctime;
        let messageData = {}

        // stage close
        const stageClose = await Stages.findOne({ where:{text:'Close'} })
        .then(result => {
            return result;
        })

        // update
        const close = await Requests.update({
            stageId:stageClose.id,
            close_date:closeDate,
            close_time:closeTime
        }, {
           where: {
                id:requestId
           } 
        })
        .then(data => {
            messageData = {
                "status":"success",
                "message":"Request Closed"
            }
        })
        .catch(err => {
            messageData = {
                "status":"error",
                "message":err
            }
        })
        if (messageData.status === "success") {
            const getRequest = await Requests.findOne({ where:{id:requestId}} )
            .then(result => {
                return result
            })

            // get data user to
            const userTo = await Users.findOne({ where:{id:getRequest.userId}} )
            .then(result => {
                return result;
            })

            // get data user from
            const userFrom = await Users.findOne({ where:{id:idLogin} })
            .then(result => {
                return result;
            })

            const notifId = uuidv4();
            const notifData = {
                "text":getRequest.title
            }

            // create notifikasi
            const createNotif = await Notifications.create({
                id:notifId,
                tableName:'requests',
                from:userFrom.name,
                to:userTo.id,
                idData:getRequest.id,
                data:JSON.stringify(notifData),
                stage:stageClose.text,
                status:0
            })
            .then(result => {
                return result;
            })     

            res.status(200).json({
                "status":messageData.status,
                "message":messageData.message,
                "notifId":notifId
            });
            res.end();
        } else if (messageData.status === "error") {
            res.status(500).json({
                "status":messageData.status,
                "message": `Error occured: ${messageData.message}`,
            });
        }
    }catch(err){
        res.status(500).json({
            message: `Error occured: ${err}`,
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
        const attachment = await RequestAttachments.findByPk(attachmentId)
        .then(data => {
            return data;
        })
        .catch((err) => {
            res.status(500).json({
                message: `Error occured: ${err}`
            }); 
        });
        if(attachment === undefined){
            res.status(400).json({
                message: `Data not found!`
            });
        }else{
            const filename = attachment.file_name;
            const filelocation = attachment.file_location;
            const fileDelete = filelocation+'/'+filename;
            // delete file
            fs.unlink(fileDelete, (error) => {
                if(error){
                    return
                }
            });
            // delete file data
            RequestAttachments.destroy({
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
        }
    } catch(err) {
        res.status(500).json({
            message: `Error  occured: ${err}`
        });
    }
}

/**
 * upload attachment
 * @param {*} req
 * @param {*} res
 */
 exports.inputAttachment = (req, res) => {
    try {
        upload(req, res, async (err) => {            
            if(err instanceof multer.MulterError) {
                res.json({message:err})
            }else{
                // parameter id
                const requestId = req.body.id;
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
                // update file attachment
                RequestAttachments.create({
                    file_name:fileUploads[0].filename,
                    file_location:fileUploads[0].filelocation,
                    alias:fileUploads[0].alias,
                    requestId:requestId
                })
                .then(data => {
                    res.status(200).json({
                        "status":"success",
                        "message":"Updated"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        "status":"error",
                        "message":`Error occured: ${err}`
                    });
                })
            }
        })
    } catch(err) {
        res.status(500).json({
            "status":"error",
            "message": `Error occured: ${err}`
        });
    }
}

