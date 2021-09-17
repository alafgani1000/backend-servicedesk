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
app.use('/static/file',express.static('upload')); 
const port = process.env.PORT || 4001;

const index =  require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');
const role = require('./routes/roles');
const team = require('./routes/team');
const category = require('./routes/category');
const stage = require('./routes/stage');
const incident = require('./routes/incident')
const request = require('./routes/request');
const notifications = require('./routes/notification');

// for socket io
const dbconfig = require('./apps/configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Notifications = dbconfig.notifications;
const Users = dbconfig.users;
const { countIncidentEmit } = require('./apps/controllers/DashboardController');
const { countNewIncident, dataServer } =  require('./apps/controllers/NotificationController');

app.use(index);
app.use('/api/user',user);
app.use('/api/auth',auth);
app.use('/api/role',role);
app.use('/api/team',team);
app.use('/api/category',category);
app.use('/api/stage',stage);
app.use('/api/incident',incident);
app.use('/api/request',request);
app.use('/api/notifications',notifications);

let interval;
io.on('connection', (socket) => {
    console.log('new client connected');
    // if(interval){
    //     clearInterval(interval);
    // }
    // interval = setInterval(() => 
    // countIncidentEmit(socket),
    // 1000);
    // interval = setInterval(() => 
    // countNewIncident(socket),
    // 1000);

    /**
     * notifikasi ada incident/problem baru
     * emit new newIncident frim client
     */
    socket.on('newIncident', async data => {
      // get new incident
      const newIncNotif = await Notifications.findOne({ where:{id:data} })
      .then(result => {
        return result;
      })
      // get user admin
      const adminUser = await Users.findOne({ where:{id:newIncNotif.to} })
      .then(result => {
        return result
      })
      // get notifications
      const notificationsData = await Notifications.findAll({ 
        where:{
          to:newIncNotif.to,
          stage:'New'
        } 
      })
      // io emit to admin for new incident or problem
      io.emit(adminUser.token, {
        "notifications":notificationsData
      })
    })
    
    socket.on('disconnect', () => {
      console.log('client disconnected');
      // clearInterval(interval)
    });
});


httpServer.listen(port, () => console.log(`listening on port ${port}`));