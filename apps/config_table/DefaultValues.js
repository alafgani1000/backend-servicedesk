const Role = require('../models/Role');

let role = () => {
    Role.create({
        role: 'admin'
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Error someting"
        });
    });    
} 

role();