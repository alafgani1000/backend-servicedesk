const db = require('../configs/database');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.getStages = (req, res) => {
    try{
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM stages';
            db.query(selectQuery, [], (error, result, fields) => {
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
            'data':[],
            'error':err
        });
        res.end();
    }
}

exports.getStage = (req, res) => {
    try{
        let idTeam = req.params.id;
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM stages WHERE id = ?'
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

exports.storeStage = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            'message':'Error',
            'send':req.body,
            'data':[],
            'errors': errors.array(), 
        });
    }
    try{
        let text = req.body.text;
        let description = req.body.description;
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let post = {
                text:text,
                description:description,
                createdAt:createdAt,
                updatedAt:updatedAt,
            };
            let storeQuery = 'INSERT INTO stages SET ?'
            db.query(storeQuery, post, (error, result, fields) => {
                if(error){
                    res.json({
                        'message':'Error',
                        'data':result,
                        'error':error
                    })
                    res.end();
                }else{
                    res.json({
                        'message':'Success',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }
            });
        }); 
    }catch(err){
        res.json({
            'message':'error',
            'error':err
        });
        res.end();
    }
}

exports.updateStage = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            'message':'Error',
            'send':req.body,
            'data':[],
            'errors': errors.array(), 
        });
    }
    try{
        let stageId = req.params.id;
        let text = req.body.text;
        let description = req.body.description;
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let updateQuery = 'UPDATE stages SET text = ?, description = ?, updatedAt = ? WHERE id = ?';
            db.query(updateQuery, [text,description,updatedAt,stageId], (error, result, fields) => {
                if(error){
                    res.json({
                        'message':'Error',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }else{
                    res.json({
                        'message':'Success',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }
            });
        });
    }catch(err){
        res.json({
            'message':'Error',
            'data':[],
            'error':err
        });
        res.end();
    }
}

exports.deleteStage = (req, res) => {
    let stageId = req.params.id;
    try{
        db.connect((err) => {
            let deleteQuery = 'DELETE FROM stages WHERE id = ?';
            db.query(deleteQuery, [stageId], (error, result, fields) => {
                if(error){
                    res.json({
                        'message':'Error',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }else{
                    res.json({
                        'message':'Success',
                        'data':result,
                        'error':error
                    });
                    res.end();
                }
            });
        });
    }catch(err){
        res.json({
            'message':'Error',
            'data':[],
            'error':err
        });
        res.end();
    }
}