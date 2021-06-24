const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
const port = process.env.PORT || 4001;
const index =  require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');
const role = require('./routes/roles');
const team = require('./routes/team');
const category = require('./routes/category');
const stage = require('./routes/stage');
const incident = require('./routes/incident')
const { Sequelize, DataTypes } = require('sequelize');
const Team = require('./apps/models/Team');
const Incident = require('./apps/models/Incident');
const IncidentAattachments = require('./apps/models/IncidentAttachments');

app.use(index);
app.use('/api/user',user);
app.use('/api/auth',auth);
app.use('/api/role',role);
app.use('/api/team',team);
app.use('/api/category',category);
app.use('/api/stage',stage);
app.use('/api/incident',incident);
Team.sync();
Incident.sync();
IncidentAattachments.sync();

let interval;
io.on('connection', (socket) => {
    console.log('new client connected');
    if(interval){
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket),1000);
    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(interval);
    });
});
const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit('FromAPI', response);
};


httpServer.listen(port, () => console.log(`listening on port ${port}`));