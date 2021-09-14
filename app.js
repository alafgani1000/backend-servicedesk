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

// for socket io
const { countIncidentEmit } = require('./apps/controllers/DashboardController')
const { countNewIncident, dataServer } =  require('./apps/controllers/NotificationController')

app.use(index);
app.use('/api/user',user);
app.use('/api/auth',auth);
app.use('/api/role',role);
app.use('/api/team',team);
app.use('/api/category',category);
app.use('/api/stage',stage);
app.use('/api/incident',incident);
app.use('/api/request',request);

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

    const data = socket.on('messageData', data => {
      io.emit('messageData', data)
    })
    
    socket.on('disconnect', () => {
        console.log('client disconnected');
        // clearInterval(interval);
    });
});


httpServer.listen(port, () => console.log(`listening on port ${port}`));