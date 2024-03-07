'use strict'

const { portExpress, cwd, serverOee, pingTimeout, pingInterval } = require('../config/router.js')
const { debug, consoleLog } = require('../config/app');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' }, pingTimeout: pingTimeout, pingInterval: pingInterval }); // // Thoi gia dinh ky kiem tra ket noi giua server va Client (pingTimeout + pingInter)
const ioClient = require('socket.io-client');
const path = require('path');
const ejs = require('ejs');
const engine = require('ejs-mate');
const cors = require('cors');
const web = require('../routes/web');
const routesStatic = require('../routes/static');
const connectIo = require('../app/channels/socketio/connect');
const disconnectIo = require('../app/channels/socketio/disconnect');
global.__io = io;
// global.__ioClient = ioClient.connect(serverOee, {reconnect: true});

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', cwd + '/resources/views');

app.use(cors());
app.use(web);
app.use(routesStatic);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.use((socket, next) => { next(); });

io.on('connection', (socket) => {
    if (consoleLog) console.log('Connection');
    connectIo(socket);
    disconnectIo(socket);
});

// // Socket Client
// __ioClient.on('connect', (socketClient) => {
//     if(consoleLog) console.log(`Connect socketio to ${serverOee}`);
// });
// __ioClient.on('disconect', (socketClient) => {
//     if(consoleLog) console.log(`Disconnect socketio to ${serverOee}`);
// });

// Start Server
server.listen(portExpress, () => { if (consoleLog) console.log(`Start Server Using Port ${portExpress}`) });