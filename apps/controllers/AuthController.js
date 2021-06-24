const db = require('../configs/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signIn = (req, res) => {
    var data;
    let username = req.body.username;
    let password = req.body.password;
    // query select data
    db.connect((err) => {
        let queryUser = 'select * from users where username = ?'
        db.query(queryUser, [username], (err,result,field) => {
            if(err) throw err 
            if(result.length === 0){
                res.json({
                    'data': result,
                    'length': result.length,
                    'messsage':'Not found'
                });
                res.end();
            }else{
                const checkSign = bcrypt.compareSync(password, result[0].password);
                let playLoad = {
                    id:result[0].username,
                    role:result[0].level,
                    group:result[0].groupuser
                };
                if(checkSign){
                    let token = jwt.sign({
                        playLoad
                    }, process.env.SECRET_KEY);
                    if(token){
                        // update token
                        let updateToken = 'UPDATE users SET token = ? WHERE id = ?';
                        db.query(updateToken, [token, result[0].id], (err,result,field) => {
                            if(err) throw err;
                        });
                    }
                    res.json({
                        'message':'Success',
                        'token': token
                    });
                    res.end();
                }else{
                    res.json({
                        'message':'User or Password Not Valid'
                    });
                    res.end();
                }
            }   
        });
    })
}
