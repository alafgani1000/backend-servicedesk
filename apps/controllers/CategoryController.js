const db = require('../configs/database');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.getCategories = (req, res) => {
    try{
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM categories';
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

exports.getCategory = (req, res) => {
    try{
        let idCat = req.params.id;
        db.connect((err) => {
            let selectQuery = 'SELECT * FROM categories WHERE id = ?'
            db.query(selectQuery, [idCat], (error, result, fields) => {
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

exports.storeCategory = (req, res) => {
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
        let interval = req.body.interval;
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let post = {
                name:name,
                time_interval:interval,
                created_at:createdAt,
                updated_at:updatedAt,
            };
            let storeQuery = 'INSERT INTO categories SET ?'
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

exports.updateCategory = (req, res) => {
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
        let idCat = req.params.id;
        let name = req.body.name;
        let interval = req.body.interval;
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        db.connect((err) => {
            let updateQuery = 'UPDATE categories SET name = ?, time_interval = ?, updated_at = ? WHERE id = ?';
            db.query(updateQuery, [name,interval,updatedAt,idCat], (error, result, fields) => {
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

exports.deleteCategory = (req, res) => {
    let catId = req.params.id;
    try{
        db.connect((err) => {
            let deleteQuery = 'DELETE FROM category WHERE id = ?';
            db.query(deleteQuery, [catId], (error, result, fields) => {
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