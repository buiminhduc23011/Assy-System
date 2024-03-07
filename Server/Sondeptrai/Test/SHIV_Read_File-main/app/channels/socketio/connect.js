'use strict'

const { statusEventPlan, nextPlan } = require('../../../enums/status');
const { consoleLog } = require('../../../config/app');

const LoginController = require('../../controllers/Auth/LoginController');
const RobotController = require('../../controllers/ROBOTController');
const AmountOfJobGen = require('../../controllers/Read_File/AmountOfJobGen');

const connectIo = (socket) => {
    const user_id = socket.id
    console.log(user_id+'- connect');
    socket.join('notification');
    console.log(socket.rooms);
    socket.on('list-clients', (msg) => {
        if (consoleLog) console.log(msg);
        socket.emit('list-clients', listClients);
    });
    socket.on('connect-machine', async (msg) => 
    {
        console.log('connect-iot',msg,socket.id);
        await socket.leave('notification');
        await socket.join('room-iot');
        await RobotController.connectIOT(socket, msg);
		socket.emit('sync-model-machine');
    });
    socket.on('machine-status', async (msg) => {    
        await RobotController.MachineStatus(socket,msg);
    });
    socket.on('push-data-tranfer', async (msg) => {
       await RobotController.pushDataTranfer(socket,msg);
    });
    socket.on('get-info-order', async (msg) => {
        await AmountOfJobGen.infor_order(msg);
    });
    socket.on('chat-message', (msg) => {
        if (consoleLog) console.log(msg);
        socket.emit('chat-message', msg.data);
    });
    socket.on('list-clients', (msg) => {
        console.log(msg);       
        if (consoleLog) console.log(msg);
        socket.emit('list-clients', listClients);
    });
    socket.on('push-data-rotor', async (msg) => {
        await RobotController.pushDataRotor(socket,msg);
    });
    socket.on('get-data-rotor-machine-with-machine', async (msg) => {
        await RobotController.getDataRotorWithMachine(socket,msg);
    });
    socket.on('get-data-rotor-machine-with-machine-waiting', async (msg) => {
        await RobotController.getDataRotorWithMachineWaiting(socket,msg);
    });
    socket.on('push-data-production', async (msg) => {
        console.log(msg);
        await RobotController.pushDataProduction(msg);
    });
    socket.on('list-order', async (msg) => {
        await AmountOfJobGen.ListOrder(socket, msg);
    });
    socket.on('input-tray', async (msg) => {
        await RobotController.TranferTray(socket, msg,1);
    });
    socket.on('output-tray', async (msg) => {
        await RobotController.TranferTray(socket, msg,2);
    });
    socket.on('cancel-tray', async (msg) => {
        await RobotController.cancelCM(socket, msg);
    });
    socket.on('Call-AGV', (msg) => {
        console.log('call-agv');
    });
    socket.on('update-status',(msg) => {
        console.log('update-status');
        console.log(msg);
    })
    socket.on('sync-model-machine',async (msg) => {
        console.log(msg);
        //await RobotController.SyncModelMachine(socket, msg);
    })
    socket.on('assy-get-data-order', async (msg) => {
        await RobotController.AssyGetDataOrder(socket,msg);
    });
    socket.on('assy-push-data-production', async (msg) => {
        await RobotController.AssyPushDataProduction(socket,msg);
    });
};


module.exports = connectIo;