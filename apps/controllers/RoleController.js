const db = require('../configs/database');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.getUserGroups = (req, res) => {
    db.connect((err) => {
        let getUserQuery = 'SELECT * FROM roles';
        db.query(getUserQuery,[],(error, result, fields) => {
            if(error){
                res.json({
                    'message':'Error',
                    'data':result,
                    'error':error
                });
                res.end();
            }
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
        });
    });
}

exports.getUserGroup = (req, res) => {
    let userGroupId = req.params.id;
    db.connect((err) => {
        let getUserGroupQuery = 'SELECT * FROM roles WHERE id = ?';
        db.query(getUserGroupQuery,[userGroupId],(error,result,fields) => {
            if(error){
                res.json({
                    'message':'Error',
                    'data':result,
                    'error':error
                });
                res.end();
            }
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
            }
        })
    });
}

exports.storeUserGroup = (req, res) => {
     /*-- 
        validation 
    --*/
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json({ 
            'message':'Error',
            'send':req.body,
            'data':[],
            'errors': errors.array(), 
        });
     }
     /*-- 
        end validation 
    --*/

    let role = req.body.role;
    let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    let updatedAt = new Date();
    let post = {
        role:role,
        created_at:createdAt,
        updated_at:updatedAt
    };
    db.connect((err) => {
        let storeUserGroupQuery = 'INSERT INTO roles SET ?';
        db.query(storeUserGroupQuery,post,(error,result,fields) => {
            if(error){
                res.json({
                    'message':'Error',
                    'send':req.body,
                    'data':result,
                    'error':error
                });
                res.end();
            }else{
                if(result.affectedRows > 0){
                    res.json({
                        'message':'Success',
                        'send':req.body,
                        'data':result,
                        'error':error
                    });
                    res.end();
                }else{
                    res.json({
                        'message':'Data not found',
                        'send':req.body,
                        'data':result,
                        'error':error
                    });
                    res.end();
                }
            }
        });
    });
}

exports.updateUserGroup = (req, res) => {
    /*-- 
        validation 
    --*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ 
           'message':'Error',
           'send':req.body,
           'data':[],
           'errors': errors.array(), 
       });
    }
    /*-- 
       end validation 
    --*/
    let userGroupId = req.params.id;
    let role = req.body.role;
    let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    db.connect((err) => {
        let queryUpdate = 'UPDATE roles SET role = ?, updated_at = ? WHERE id = ?'
        db.query(queryUpdate,[role,updatedAt,userGroupId],(error,result,fields) => {
            if(error){
                res.json({
                    'message':'Success',
                    'data':result,
                    'error':error
                });
                res.end();
            }else{
                if(result.affectedRows > 0){
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
                }
            }
        });
    });
}

exports.deleteUserGroup = (req, res) => {
    let userGroupId = req.params.id;
    db.connect((err) => {
        let queryDelete = 'DELETE FROM roles WHERE id = ?';
        db.query(queryDelete,[userGroupId],(error,result,fields) => {
            if(error){
                res.json({
                    'message':'Error',
                    'data':result,
                    'error':errror
                }); 
                res.end();
            }else{
                if(result.affectedRows > 0){
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
}