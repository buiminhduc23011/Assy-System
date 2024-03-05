'use strict'

const {cwd}     = require('../config/router.js')
,express        = require('express')
,app            = express()
,ejs            = require('ejs')
,engine         = require('ejs-mate')
,HomeController    = require('../app/controllers/HomeController')
,ROBOTController     = require('../app/controllers/ROBOTController')
,LoginController   = require('../app/controllers/Auth/LoginController');

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', cwd + '/resources/views');

app.get('/', (req, res) => {HomeController.home(req, res);});
app.get('/iot-status', (req, res) => {HomeController.IotStatus(req, res);});
app.get('/iot-update-firmware', (req, res) => {HomeController.IotUpdateFirmware(req, res);});
app.get('/api/test', (req, res) => {HomeController.apiTest(req, res);});
app.get('/api/insert-device', (req, res) => {ROBOTController.getQueryListIOT(req, res);});
app.get('/api/update-led-iot', (req, res) => {ROBOTController.updateLedIot(req, res);});
app.get('/api/get-list-map', (req, res) => {ROBOTController.getListMap(req, res)});
app.get('/api/get-list-forder', (req, res) => {ROBOTController.listForder(req, res)});
app.post('/api/upload-file', (req, res) => {ROBOTController.uploadFileFirmware(req, res)});
app.get('/api/download-firmware', (req, res) => {ROBOTController.downloadFirmware(req, res)});

app.get('/update-list-machine', (req, res) => {ROBOTController.get_list_machine();res.send(true);});
app.get('/update-list-axis', (req, res) => {ROBOTController.get_list_axis();res.send(true);});

app.get('/api/ur', (req, res) => 
{
    const ipAddress = req.ip;
    const ipAddress_split = ipAddress.split(':');
    let ip = ipAddress_split[3];
    console.log(ipAddress_split,req.query);
    //res.send(`Địa chỉ IP của bạn là: ${ip}`);
    return res.send({ status: true, message: 'Success' });
  });

module.exports = app; 