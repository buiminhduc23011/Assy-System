'use strict'

const Controller          = require('../../controllers/Controller');
const {statuSocket}       = require('../../../enums/status');
const {cacheDeleteClient} = require('../../../config/cache');
const MasterMachine = require('../../models/MasterMachine');

const disconnectIo = (socket) => {
    socket.on('disconnect', async () => {
        let data    = {};
        let client  = await Controller.findClient('', socket.id);
        console.log('disconnect');
        //console.log(client);
        if(client.status) 
        {

            listClients[client.pos].connect        = statuSocket.disconnect;
            //console.log(listClients[client.pos]);
            // await MasterMachine().query(`update master_machine set isconnected = 0 where id = ${listClients[client.pos].machineId}`);
            __io.to('notification').emit('notification', {server: data, client: client.data.machineName, event: 'disconnected'});
            __io.to('notification').emit('list-clients', listClients);

            disconnectLog.debug(JSON.stringify({server: data ?? {}, client: client, event: 'disconnected'}));
            // setTimeout(() => {deleteClient(socket)}, cacheDeleteClient);
        }
    });
}

// Xoa client sau khi khong connect lai 1 khoang thoi gian
const deleteClient = async (socket = []) => {
    let client = await Controller.findClient('', socket.id);
    let clientlogout = await Controller.findClientLogout('', socket.id);

    if(client.status) if(client.data.connect == statuSocket.disconnect) listClients.splice(client.pos, 1);

    if(clientlogout.status) listLogouts.splice(clientlogout.pos, 1);

    return true;
}

module.exports = disconnectIo;