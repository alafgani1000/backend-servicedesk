const db = require('../configs/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbconfig = require('../configs/db.config');
const Users = dbconfig.users;
const Roles = dbconfig.roles;
const Teams = dbconfig.teams;
require('dotenv').config();

/**
 * login
 * @param {*} req 
 * @param {*} res 
 */
exports.signIn = async (req, res) => {
    try{
        var dataRole;
        let username = req.body.username;
        let password = req.body.password;
        // get user
        const user = await Users.findOne({ where: { username:username },
            include: [
                { 
                    model: Roles,
                    as: "userRole",
                }, 
                {
                    model: Teams,
                    as: "userTeam",
                }
            ] 
        })
        .then(result => {
            return result;
        });

        // check user data
        if(user !== null){
            const checkSign = bcrypt.compareSync(password, user.password);
            let playLoad = {
                id:user.username,
                idrole:user.level,
                group:user.groupuser,
                role:user.userRole.role
            };
            if(checkSign){
                let token = jwt.sign({
                    playLoad
                }, process.env.SECRET_KEY);
                if(token){
                    // update token
                    const updateUser = await Users.update({
                        token:token
                    }, {
                        where: {
                            id:user.id
                        }
                    })
                    .then(result => {
                        return result
                    })
                  
                }   
                global.GidRole = user.level
                global.GRole = user.userRole.role
                global.idLogin = user.id                    
                res.json({
                    'message':'Success',
                    'token': token,
                    'role':user.userRole.role,
                    'group':user.userTeam.name,
                    'name':user.name
                });
            }
        }else{
            res.status(401).json({
                'data': user,
                'length': user.length,
                'messsage':'Not found'
            });
            res.end();
        }
    }catch(err){
        res.status(500).json({
            message: `Error occured: ${err}`,
        });
    }
}
