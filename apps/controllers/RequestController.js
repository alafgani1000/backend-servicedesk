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
 * input incident
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