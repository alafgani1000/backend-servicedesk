const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../configs/database');

/*
    middleware for checked auth
*/
exports.isAuth = (req, res, next) => {
    try{
        const token = req.headers.token;
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        const username = decoded.playLoad.id;
        const idrole = decoded.playLoad.idrole;
        const role = decoded.playLoad.role;
        db.connect((err) => {
            let queryUser = 'select * from users where username = ?'
            db.query(queryUser, [username], (err,result,field) => {
                if(err) throw err 
                if(result.length === 0){
                    res.status(401).json({
                        'message':'Token invalid',
                        'stastus': '401'
                     })
                     res.end()
                }else{
                    if(result[0].token === token){
                        global.idLogin = result[0].id;
                        global.GidRole = idrole;
                        global.GRole = role;
                        next();
                    }else{
                        res.status(401).json({
                            'message':'Token invalid',
                            'stastus': '401'
                        })
                        res.end()
                         
                    }
                }   
            })
        })
    }catch(err){
        res.status(401).json({
           'message':'Token invalid',
           'stastus': '401'
        })
        res.end()
    }
}

/**
    middleware for checked role authorized 
    @param  role
    combination with AuthHelper.role('admin')
    example: var.hashRole(AuthHelper.role('admin'))
*/
exports.hashRole = (role) => {
    return (req, res, next) => {
        try{
            const token = req.headers.token;
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            if(decoded.idrole === role){
                next();
            }else{
                res.json({
                    'message':'User Not Authorized',
                    'status':'401'
                });
            }
        }catch(err){
            res.json({
                'message':'User Not Authorized',
                'status':err
            });
        }
    }
}