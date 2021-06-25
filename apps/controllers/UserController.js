const bcrypt = require('bcrypt');
const db = require('../configs/database');
const { validationResult } = require('express-validator');

exports.getUser = (req, res) => {
    let userId = req.params.id;
    db.connect((err) => {
        let getUserQuery = 'SELECT * FROM users WHERE id = ?';
        db.query(getUserQuery,[userId], function(error, result, fields){
            if(error) throw error;
            if(result.length > 0){
               res.json({
                   'messaage':'Success',
                   'data':result[0],
               });
               res.end();
            }else{
                res.json({
                    'message':'Data not found'
                });
                res.end();
            }
        });
    });
}

exports.getUsers = (req, res) => {
    db.connect((err) => {
        let getUsersQuery = 'SELECT * FROM users';
        db.query(getUsersQuery,[], (error, result, fields) => {
            if(error) throw errror;
            res.json({
                'message': 'Success',
                'data': result
            });
        });
    });
}

exports.storeUser = (req, res) => {
    let userName = req.body.username;
    let name = req.body.name;
    let email = req.body.email;
    let level = req.body.level;
    let group = req.body.group; 
    let status = 'nothing';
    let post = { 
        username:userName, 
        name:name, 
        password:password, 
        email:email, 
        level:level, 
        groupuser:group 
    };
    db.query('INSERT INTO users SET ?',post,function(error, result, fields){
        if(error){
            res.json({
                'message':'Error',
                'send':req.body,
                'data':result,
                'error':error
            }); 
            res.end();
        }else{
            res.json({
                'message':'Success',
                'send':req.body,
                'data':result,
                'error':error
            });
            res.end();
        }
    });
    
}

exports.updateUserForAdmin = (req, res) => {
    /*-- validation --*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    /*-- end validation --*/
    let userId = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let level = req.body.level;
    let group = req.body.groupuser;
    let password = req.body.password;
    // if password not empty
    if (password === '') {
        db.connect((err) => {
            let updateUserQuery = 'UPDATE users SET name = ?, email = ?, level = ?, groupuser = ?  WHERE id = ?';
            db.query(updateUserQuery,[name,email,level,group,userId],(error,result,fields) => {
                if (error) throw error
                res.json({
                    'message':'Success',
                    'result':result
                });
                res.end();
            });
        }); 
    } else {
        db.connect((err) => {
            password = bcrypt.hashSync(req.body.password,10);
            let updateUserQuery = 'UPDATE users SET name = ?, email = ?, level = ?, groupuser = ?, password = ? WHERE id = ?';
            db.query(updateUserQuery,[name,email,level,group,password,userId],(error,result,fields) => {
                if (error) throw error
                res.json({
                    'message':'Success',
                    'result': result
                });
                res.end();
            });
        }); 
    }
}

exports.destroyUser = (req, res) => {
    let userId = req.params.id;
    db.connect((err) => {
        deleteQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteQuery,[userId],(error,result,fields) => {
            if(error) throw error
            res.json({
                'message':'Success',
                'data':result
            });
        });
    });
}
