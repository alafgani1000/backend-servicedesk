const db = require('../configs/database');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.getTeams = (req, res) => {
    try{
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM teams';
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

exports.getTeam = (req, res) => {
    try{
        let idTeam = req.params.id;
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM teams WHERE id = ?'
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
                            'data':result[0],
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

exports.storeTeam = (req, res) => {
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
        let name = req.body.name;
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let post = {
                name:name,
                created_at:createdAt,
                updated_at:updatedAt,
            };
            let storeQuery = 'INSERT INTO teams SET ?'
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
            'message':'e',
            'error':err
        });
        res.end();
    }
}

exports.updateTeam = (req, res) => {
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
        let idTeam = req.params.id;
        let name = req.body.name;
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let updateQuery = 'UPDATE teams SET name = ?, updated_at = ? WHERE id = ?';
            db.query(updateQuery, [name,updatedAt,idTeam], (error, result, fields) => {
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

exports.deleteTeam = (req, res) => {
    let teamId = req.params.id;
    try{
        db.connect((err) => {
            let deleteQuery = 'DELETE FROM teams WHERE id = ?';
            db.query(deleteQuery, [teamId], (error, result, fields) => {
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