const { Op } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const sequelize = require('../configs/connection');
const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const { validationResult } = require('express-validator');
const db = require('../configs/database');

const dbconfig = require('../configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Users = dbconfig.users;
const Notifications = dbconfig.notifications;

const storage = require('../middlewares/upload');
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
        }else if(mimetype === "image/jpeg" || mimetype === "image/png"){
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
exports.viewIncidents = async (req, res) => {
    var condition = null;
    if(GRole === 'admin'){
        condition = null
    }else if(GRole === "technician"){
        const user = await Users.findOne({ where: {id:idLogin} })
            .then(result => {
                return result;
            })
        condition = {
            teamId:user.groupuser
        }
    }else{
        condition = {
            userId:idLogin
        };
    }
    await Incidents.findAll({ 
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
        upload(req, res, async (err) => {            
            if(err instanceof multer.MulterError) {
                res.json({message:err})
            }else{
                 // inisiasi variabel
                let text = req.body.text;
                let location = req.body.location;
                let phone = req.body.phone;
                let user_id = idLogin;
                let stage_id = req.body.stage_id;
                let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let dataMessage = {};
                
                // get data file uploads
                let files = req.files;
                // console.log(idLogin);
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
                let idNotif = uuidv4();
                // insert data
                const insert = await Incidents.create({
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
                    // res.status(200).json({
                    //     "message":"Success",
                    //     "data":idIndicent
                    // });
                    // res.end();
                    dataMessage = {
                        "message":"success"
                    }
                })
                .catch(err => {
                    // if error
                    // res.status(500).send({
                    // message:
                    //     err.message || "Error someting"
                    // });
                    dataMessage = {
                        "message":"error",
                        "data":err
                    }
                });   
                // if success create
                if(dataMessage.message === "success"){
                    const dinc = await Incidents.findOne({ where:{ id:idIndicent },
                        include: 
                        [
                            { 
                                model: Stages,
                                as: "stageIncidents",
                                attributes:["id","text","description"]
                            },
                            {
                                model: Users,
                                as: "userIncidents",
                                attributes:["id","name"]
                            }
                        ]
                    })
                    .then(result => {
                        return result
                    })
                    if(dinc !== null){
                        // get admin user
                        const admin = await Users.findOne({ where:{level:1} })
                        .then(result => {
                            return result;
                        })
                        const dataNotif = {
                            "text":dinc.text
                        }
                        // insert to table notification
                        const insertNotif = await Notifications.create({
                            id:idNotif,
                            tableName:"incidents",
                            idData:dinc.id,
                            data:JSON.stringify(dataNotif),
                            from:dinc.userIncidents.name,
                            to:admin.id,
                            stage:dinc.stageIncidents.text,
                            status:0,
                            createdAt:createdAt,
                        })
                        .then(result => {
                            return result;
                        })
                        .catch(error => {
                            return error;
                        });
                    }
                    return res.status(200).json({
                        "message":"Success",
                        "data":idNotif
                    })
                }else if(dataMessage.message === "error"){
                    return res.status(500).json({
                        "message": err.message || "Error someting"
                    })
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
 * Delete incident
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteIncident = (req, res) => {
    // inisiasi valriabel
    const incidentId = req.params.id;

    try{
        // delete 
        Incidents.destroy({
            where: {
                id:incidentId
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
    }catch(err){
        res.json({
            message: `Error occured: ${err}`
        })
    }
   

}

/**
 * update data incident
 * @param {*} req 
 * @param {*} res 
 */
exports.updateIncident = (req, res) => {
    // inisiasi variabel
    console.log(req.body);
    const incidentId = req.params.id;
    let text = req.body.text;
    let location = req.body.location;
    let phone = req.body.phone;
    let user_id = idLogin;
    let stage_id = req.body.stage_id;
    let updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    try{
        // update incident
        Incidents.update({
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
 * membuat nomor ticket incident
 * @param {incidentId}
 * @return {ticket}
 */
const genNumberTicket = (code) => {
    // create ticket number
    const phrase = 'I';
    var jumlahDigit = 7;
    var codeString = `${code}`;
    var jumlahIncidentId = codeString.length;
    console.log(jumlahDigit - jumlahIncidentId);
    var selisih = jumlahDigit - jumlahIncidentId;
    var zeroCount = '0000000';
    var jumlahNol = zeroCount.substr(1, selisih);
    var ticket = phrase+jumlahNol+code;
    return ticket;
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
         
        // get data incident
        const dataIncident = await Incidents.findOne({ where: { id:req.params.id } })
        .then(result => {
            return result;
        })

        // get data stage open
        const openStage = await Stages.findOne({where: {text:'Open'}})
        .then(result => {
            return result;
        })

        // initiate variable
        let incidentId = req.params.id;
        let teamId = req.body.team_id;
        let ticket = genNumberTicket(dataIncident.code);
        let categoryId = req.body.category_id;
        let stageId = openStage.id;
        let validation = [];
        let dataMessage = {}
        let createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
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
            const update = await Incidents.update({
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
                dataMessage = {
                    message:'Success',
                }
            })
            .catch(err => {
                return {
                    message:'Error',
                    data:err
                }
            });

            if(dataMessage.message === 'Success'){
                const notifId = uuidv4();
                // get data incident 
                const dataUpdate = await Incidents.findOne({ where:{ id:incidentId } })
                    .then(result => {
                        return result;
                    })
                // data user
                const userIncident = await Users.findOne({ where: { id:dataUpdate.userId }})
                    .then(result => {
                        return result;
                    })
                // data pengirim
                const fromUser =  await Users.findOne({ where: { level:1 }})
                    .then(result => {
                        return result;
                    })
                // insert notification
                const dataNotif = {
                    text:dataUpdate.text,
                    ticket:dataUpdate.ticket,
                }
                const insertNotif = await Notifications.create({
                    id:notifId,
                    tableName:"incidents",
                    from:fromUser.name,
                    to:userIncident.id,
                    idData:dataUpdate.id,
                    data:JSON.stringify(dataNotif),
                    stage:stageId,
                    status:0,
                    createdAt:createdAt
                })

                res.status(200).json({
                    "message":"Success",
                    "notifId":notifId,
                    "data":dataUpdate
                });
                res.end();
            }else if(dataMessage.message === 'Error'){
                res.status(500).json({
                    message: `Error occured: ${dataMessage.err}`,
                });
            }
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
exports.resolve = async (req, res) => {
    try {
        // initiate variable
        let incidentId = req.params.id;
        let resolveText = req.body.resolve_text;
        let dateNow = moment();
        let createdAt = dateNow.format("YYYY-MM-DD HH:mm:ss");
        let resolveDate = dateNow.format('YYYY-MM-DD');
        let resolveTime = dateNow.format('HH:mm:ss');
        let teknisi = idLogin;
        let messageData = {
            message:"",
            data:""
        }

        // get stage resolve
        const stageResolve = await Stages.findOne({ where:{text:'Resolve'} })
            .then(result => {
                return result;
            })

        // update data
        const resolveIncident = await Incidents.update({
           resolve_text:resolveText,
           resolve_date:resolveDate,
           resolve_time:resolveTime,
           user_technician:teknisi,
           stageId:stageResolve.id
        }, {
            where: {
                id:incidentId
            }
        })
        .then(data => {
            // res.status(200).json({
            //     "message":"Resolved"
            // });
            // res.end();
            messageData = {
                message:"resolved"
            }
        })
        .catch(err => {
            // res.status(500).json({
            //     message: `Error occured: ${err}`,
            // });
            messageData = {
                message:"error",
                data:err
            }
        });
        
        // check message
        if(messageData.message === "resolved"){
            const notifId = uuidv4();
            // get data incident
            const dataInc = await Incidents.findOne({ where:{id:incidentId} })
                .then(result => {
                    return result;
                })
            // get from
            const fromUser = await Users.findOne({ where:{id:idLogin} })
                .then(result => {
                    return result;
                })
            // get to
            const toUser = await Users.findOne({ whre:{id:dataInc.userId} })
                .then(result => {
                    return result;
                })
            // create notif
            const dataNotif = {
                "text":dataInc.text
            }
            const insertNotif = await Notifications.create({
                id:notifId,
                tableName:'incidents',
                from:fromUser.name,
                to:dataInc.userId,
                idData:dataInc.id,
                data:JSON.stringify(dataNotif),
                stage:stageResolve.text,
                status:0,
                createdAt:createdAt
            });
            
            res.status(200).json({
                "message":"Resolved",
                "notifId":notifId
            });
            res.end();
        }else{
            res.status(500).json({
                "message": `Error occured data: ${messageData.data}`,
            });
            res.end();
        }
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
                const incidentId = req.body.id;
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
                IncidentAttachments.create({
                    filename:fileUploads[0].filename,
                    filelocation:fileUploads[0].filelocation,
                    alias:fileUploads[0].alias,
                    incidentId:incidentId
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
        const attachment = await incidentAttachments.findByPk(attachmentId)
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
            const filename = attachment.filename;
            const filelocation = attachment.filelocation;
            const fileDelete = filelocation+'/'+filename;
            // delete file
            fs.unlink(fileDelete, (error) => {
                if(error){
                    return
                }
            });
            // delete dile
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
        }
    } catch(err) {
        res.status(500).json({
            message: `Error  occured: ${err}`
        });
    }
}
