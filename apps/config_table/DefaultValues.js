const Role = require('../models/Role');
const Category = require('../models/Category');
const Team = require('../models/Team');
const Stage = require('../models/Stage');

let role = () => {
    Role.create(
        {
            role: 'admin'
        }
    )
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Error someting"
        });
    });    
} 

let team = () => {
    Team.create({
        name: 'HARDWARE'
    });

    Team.create({
        name: 'SOFTWARE'
    });

    Team.create({
        name: 'NETWORK'
    });

    Team.create({
        name: 'ADMIN'
    });

}

let category = () => {
    Category.create({
        name: 'GOLD',
        time_interval: 48
    });

    Category.create({
        name: 'SILVER',
        time_interval: 24
    });

    Category.create({
        name: 'BRONZE',
        time_interval: 8
    });

    Category.create({
        name: 'EARTH',
        time_interval: 4
    });
}

let stage = () => {
    Stage.create({
        text: 'New',
        description: "New Incident"
    });

    Stage.create({
        text: 'Open',
        description: 'Incident sedang dikerjakan'
    });

    Stage.create({
        text: 'Close',
        description: 'Incident selesai ditangani'
    });

    Stage.create({
        text: 'Archive',
        description: 'Incident diarsipkan'
    });
}

role();
category();
team();