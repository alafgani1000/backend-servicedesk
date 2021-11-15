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
const peminjaman = require('./routes/Peminjaman');

// for socket io
const dbconfig = require('./apps/configs/db.config');
const Incidents = dbconfig.incidents;
const IncidentAttachments = dbconfig.incidentAttachments;
const Stages = dbconfig.stages;
const Teams = dbconfig.teams;
const Categories = dbconfig.categories;
const Notifications = dbconfig.notifications;
const Users = dbconfig.users;
const { countIncidentEmit, countRequestEmit } = require('./apps/controllers/DashboardController');
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
app.use('/api/peminjaman',peminjaman);

let interval;
io.on('connection', (socket) => {
    console.log('new client connected');
    if(interval){
        clearInterval(interval);
    }
    interval = setInterval(() => 
      countRequestEmit(socket),
    1000);
    interval = setInterval(() => 
      countIncidentEmit(socket),
    1000);
    socket.on('disconnect', () => {
      console.log('client disconnected');
      clearInterval(interval)
    });
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
          status:0
        } 
      })
      // io emit to admin for new incident or problem
      io.emit(adminUser.token, {
        "notifications":notificationsData
      })
    })

    socket.on('inputTicket', async data => {
      // get data notification
      const notif = await Notifications.findOne({ where:{id:data} })
        .then(result => {
          return result;
        })
      // get data user
      const user = await Users.findOne({ where: {id:notif.to} })
        .then(result => {
          return result;
        })
      // get data notifications
      const notificationsData = await Notifications.findAll({
        where: {
          to:notif.to,
          status:0
        }
      })
      .then(result => {
        return result;
      })
      // emit notifications
      io.emit(user.token, {
        "notifications":notificationsData
      })
      
    })

    // handle notification resolve incident
    socket.on('resolveIncident', async data => {
      // get data notification
      const notif = await Notifications.findOne({ where:{id:data} })
        .then(result => {
          return result;
        })
      // get data user
      const user =  await Users.findOne({ where: {id:notif.to} })
        .then(result => {
          return result;
        })
      // get data notifications
      const notificationsData = await Notifications.findAll({
        where: {
          to:notif.to,
          status:0
        }
      })
      .then(result => {
        return result;
      })
      // emit notification
      io.emit(user.token, {
        "notifications":notificationsData
      })
    })

    // handle notification close incident
    socket.on('closeIncident', async data => {
       data.forEach( async (item, index) => {
        // get data 
        const notif = await Notifications.findOne({ where:{id:item} })
        .then(result => {
          return result;
        })
        // get data user
        const user = await Users.findOne({ where:{id:notif.to} })
        .then(result => {
          return result;
        })
        // get notifications
        const notificationsData = await Notifications.findAll({
          where:{
            to:notif.to,
            status:0
          }
        })
        .then(result => {
          return result;
        })
        // emit notifications
        io.emit(user.token, {
          "notifications":notificationsData
        })
      });
    })

    socket.on('newRequest', async data =>{
       // get data notification
       const notif = await Notifications.findOne({ where:{id:data} })
       .then(result => {
         return result;
       })
      // get data user
      const user =  await Users.findOne({ where: {id:notif.to} })
        .then(result => {
          return result;
        })
      // get data notifications
      const notificationsData = await Notifications.findAll({
        where: {
          to:notif.to,
          status:0
        }
      })
      .then(result => {
        return result;
      })
      // emit notification
      io.emit(user.token, {
        "notifications":notificationsData
      })
    })

    socket.on('openRequest', async data => {
      // get data notification
      const notif = await Notifications.findOne({ where:{id:data} })
      .then(result => {
        return result;
      })
      // get data user
      const user =  await Users.findOne({ where:{id:notif.to} })
      .then(result => {
        return result;
      })
      // get data notifications
      const notificationsData = await Notifications.findAll({
        where: {
          to:notif.to,
          status:0
        }
      }).then(result => {
        return result;
      })
      // emit notification
      io.emit(user.token, {
        "notifications":notificationsData
      })
    })

    socket.on('resolveRequest', async data => {
      // get data notification
      const notif = await Notifications.findOne({ where:{id:data} })
      .then(result => {
        return result;
      })
      // get data user
      const user = await Users.findOne({ where:{id:notif.to} })
      .then(result => {
        return result;
      })
      // get data notifications 
      const notificationsData = await Notifications.findAll({
        where:{
          to:notif.to,
          status:0
        }
      })
      io.emit(user.token, {
        "notifications":notificationsData
      })
    })

    socket.on('closeRequest', async data => {
      // get data notification
      const notif = await Notifications.findOne({ where:{id:data} })
      .then(result => {
        return result;
      })
      // get data user
      const user = await Users.findOne({ where:{id:notif.to} })
      .then(result => {
        return result
      })
      // get data notifications
      const notificationsData = await Notifications.findAll({
        where:{
          to:notif.to,
          status:0
        }
      })
      io.emit(user.token, {
        "notifications":notificationsData
      })
    })
    
    // socket.on('disconnect', () => {
    //   console.log('client disconnected');
    //   // clearInterval(interval)
    // });
});


httpServer.listen(port, () => console.log(`listening on port ${port}`));