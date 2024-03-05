'use strict'

const home = async (req, res) => {
    return res.render('home', {
        namePage: 'Dashboard'
    });
}

const listClientConnect = (status = 1) => {
    let data = [];

    for (let client of listClients) {
        if (client.connect == status) data.push(client);
    }

    return data;
}

const main = async (req, res) => {
    return res.render('./layouts/main')
}

const apiTest = (req, res) => {
    return res.send({ status: true, message: 'Success' });
}

const IotStatus = (req, res) => {
    let dataConnect = listClientConnect();
    let dataDisconnect = listClientConnect(0);

    return res.render('iotStatus', {
        namePage: 'Machine Status',
        data: listClients,
        dataConnect: dataConnect,
        dataDisconnect: dataDisconnect
    });
}

const IotUpdateFirmware = (req, res) => {
    return res.render('updateFirmwareIot', {
        namePage: 'Update Firmware IOT',
        data: listClients
    });
}

module.exports = { home, main, apiTest, IotStatus, IotUpdateFirmware }