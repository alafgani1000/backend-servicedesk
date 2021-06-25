const Role = require('../models/Role');

exports.role = () => {
    Role.create({
        role: 'admin'
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Error someting error"
        });
    });    
} 