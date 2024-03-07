'use strict'

module.exports = {};

const config   = require('../../config/router')
, {consoleLog} = require('../../config/app')
, Model        = require('../../services/model');

// Tim kiem client
const findClient = (mac = '', idSocket = '') => {
    //console.log(listClients,mac);
    try {
        for(let i = 0; i < listClients.length; i++) {
            let fin0 = listClients[i].mac.toUpperCase() == mac.toUpperCase(),
                fin1 = listClients[i].idSocket == idSocket;
                //console.log(fin0,fin1,listClients[i],idSocket);
            switch (true) {
                case (mac !== '' && idSocket !== ''):
                    if(fin0 && fin1) return {status: true, data: listClients[i], pos: i};
                    break;
                case (mac !== ''):
                    if(fin0) return {status: true, data: listClients[i], pos: i};
                    break;
                case (idSocket !== ''):
                    if(fin1) return {status: true, data: listClients[i], pos: i};
                    break;
            }
        }
        return {status: false, data: []};
    } catch(e) {
        logger.error("Error find client");
        logger.error(e);
        return {status: false, data: []};
    }
}

const findClientWithid = (machineId = '', idSocket = '') => 
{
    //console.log(listClients,mac);
    try {
        for(let i = 0; i < listClients.length; i++) {
            let fin0 = listClients[i].machineId == machineId,
                fin1 = listClients[i].idSocket == idSocket;
                //console.log(fin0,fin1,listClients[i],idSocket);
            switch (true) {
                case (machineId !== '' && idSocket !== ''):
                    if(fin0 && fin1) return {status: true, data: listClients[i], pos: i};
                    break;
                case (machineId !== ''):
                    if(fin0) return {status: true, data: listClients[i], pos: i};
                    break;
                case (idSocket !== ''):
                    if(fin1) return {status: true, data: listClients[i], pos: i};
                    break;
            }
        }
        return {status: false, data: []};
    } catch(e) {
        logger.error("Error find client");
        logger.error(e);
        return {status: false, data: []};
    }
}
// Tim kiem client Logout
const findClientLogout = (mac = '', idSocket = '') => {
    try {
        for(let i = 0; i < listLogouts.length; i++) {
            let fin0 = listLogouts[i].mac.toUpperCase() == mac.toUpperCase(),
                fin1 = listLogouts[i].idSocket == idSocket;
            switch (true) {
                case (mac !== '' && idSocket !== ''):
                    if(fin0 && fin1) return {status: true, data: listLogouts[i], pos: i};
                    break;
                case (mac !== ''):
                    if(fin0) return {status: true, data: listLogouts[i], pos: i};
                    break;
                case (idSocket !== ''):
                    if(fin1) return {status: true, data: listLogouts[i], pos: i};
                    break;
            }
        }
        return {status: false, data: []};
    } catch(e) {
        logger.error("Error find client");
        logger.error(e);
        return {status: false, data: []};
    }
}
// Kiem tra bo goi da duoc dang ky hay chua
const checkMacConfig = (mac = '') => {
    try {
        if(config.checkMac == 'false') return true;
        for(let i = 0; i < listClients.length; i++ ) {
            if(listClients[i].mac.toUpperCase() == mac.toUpperCase()) return true;
        }
        return false;
    } catch(e) {
        logger.error("Error check mac config");
        logger.error(e);
        return false;
    }
}
// Tim kiem IOT
const findIot = (mac = '') => {
    try {
        if(mac == '') return {status: false, data: []};
        let data = [];
        for(let i = 0; i < listClients.length; i++) {
            if(listClients[i].mac.toUpperCase() == mac.toUpperCase()) data.push(listClients[i]);
        }
        if(data.length == 0) return {status: false, data: []};
        return {status: true, data: data};
    } catch(e) {
        logger.error("Error find IOT");
        logger.error(e);
        return {status: false, data: []};
    }
}

// Filter Machine
const findMachine = (mac = '', idMachine = '') => {
    try {
        for(let i = 0; i < listMachine.length; i++) {
            let fin0 = listMachine[i].MAC.toUpperCase() == mac.toUpperCase(),
                fin1 = Number(listMachine[i].ID) == Number(idMachine);
            switch (true) {
                case (mac !== '' && idMachine !== ''):
                    if(fin0 && fin1) return {status: true, data: listMachine[i], pos: i};
                    break;
                case (mac !== ''):
                    if(fin0) return {status: true, data: listMachine[i], pos: i};
                    break;
                case (idMachine !== ''):
                    if(fin1) return {status: true, data: listMachine[i], pos: i};
                    break;
            }
        }

        return {status: false, data: [], pos: 0};
    } catch(e) {
        logger.error("Error find machine");
        logger.error(e);
        return {status: false, data: [], pos: 0};
    }
}

// Filter Product
const findProduct = (id = 0) => {
    try {
        for(let i = 0; i < listProduct.length; i++) {
            if(Number(listProduct[i].ID) == Number(id)) {
                return {status: true, data: listProduct[i]};
            }
        }

        return {status: false, data: []};
    } catch(e) {
        logger.error("Error find product");
        logger.error(e);
        return {status: false, data: []};
    }
}

// Emit event Fail
const emitFail = async(socket, event = '', message = '', emitAll = '') => {
    let data = {
        status : false,
        message: convStrToUnsigned(message),
        time   : moment().format('YYYY-MM-DD HH:mm:ss')
    };

    socket.emit(event, data);
    if(emitAll !== '')  __io.to('notification').emit(emitAll, {server: data, client: message, event: event});
}

// Check Permission
const checkPermission = async(mac = '', permission = '', user = null) => {
    // return true;
    let client = null;
    let userId = 0;
    if(user) userId = Number(user.id ?? (user.ID ?? 0));
    // Tim kiem mac
    if(mac !== '') {
        for(let i = 0; i < listClients.length; i++) {if(listClients[i].mac.toUpperCase() == mac.toUpperCase()) {client = listClients[i]; break}}
        // Neu kho ton tai user
        if(!client) {console.log('user', mac, permission, client, 'send',mac, permission, userId);return false;}
        // Neu user la ADMIN
        if(Number(client.levelUser) == 9999) return true;
    }

    if(userId != 0) if(Number(user.level) == 9999) return true;
    // Tim kiem quyen theo user
    for(let i = 0; i < listPermission.length; i++) {
        if(mac !== '') {
            if(Number(listPermission[i].user_id) == Number(client.userId) && listPermission[i].role.toUpperCase() == permission.toUpperCase()) return true;
        } else if(userId != 0) {
            if(Number(listPermission[i].user_id) == userId && listPermission[i].role.toUpperCase() == permission.toUpperCase()) return true;
        }
    }

    // Tim kiem quyen theo nhom quyen
    for(let i = 0; i < listGroupPermission.length; i++) {
        if(mac !== '') {
            if(Number(listGroupPermission[i].user_id) == Number(client.userId) && listGroupPermission[i].role.toUpperCase() == permission.toUpperCase()) return true;
        } else if(userId != 0) {
            if(Number(listGroupPermission[i].user_id) == userId && listGroupPermission[i].role.toUpperCase() == permission.toUpperCase()) return true;
        }
    }

    return false;
}
// Emit Plan
const emitPlan = async (plan = [], product = []) => {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'),'::','emit plan');
    let isDelete = plan.IsDelete ?? 0;
    if(isDelete) plan = [];

    let productName = product?.data?.Symbols ?? '';
    let planNumber  = plan.Symbols      ?? '';
    let charge      = plan.Charge       ?? '';
    let process     = plan.Process      ?? '';
    
    let machine = await findMachine('', plan.Machine_ID ?? 0);
    let client  = await findClient(machine.data?.MAC ?? '');
    let data    =  {
        status    : true,
        planId    : plan.ID ?? 0,
        userId    : client.data?.id ?? 0,
        machineId : machine.data?.ID ?? 0,
        product   : convStrToUnsigned(productName),  
        planNumber: convStrToUnsigned(planNumber),
        charge    : convStrToUnsigned(charge),
        qty       : plan.Quantity_Real ?? 0, // So luong san xuat thuc te
        qtyPlan   : plan.Quantity_Schedule ?? 0,
        qtyInsert : plan.Quantity_Insert ?? 0,
        process   : convStrToUnsigned(process),
        lotno     : plan.Lot_Number ?? '',
        ivt       : 1.2,
        htb       : client.data.htb ?? 0,
        hsd       : client.data.hsd ?? 0,
        hkd       : client.data.hkd ?? 0,
        hld       : client.data.hld ?? 0,
        q         : client.data.q ?? 0,
        statusPlan: plan.Status ?? 0,
        timeSetup : plan.Time_Setup ?? 0,
        timeCheck : plan.Time_Check ?? 0,
        capacity  : plan.Capacity ?? 1,
        time      : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    if(client.status) listClients[client.pos].planStart = data;

    return data;
}

const timeDb = ['created_at', 'updated_at', 'Time_Created', 'Time_Updated', 'Time_Schedule_Start', 'Time_Schedule_End', 'Time_Real_Start', 'Time_Real_End'];
const typeString = ['nvarchar', 'char', 'varchar', 'text'];

const convertTimeDb = (time = '') => {
    return moment(time).utc().format('YYYY-MM-DD HH:mm:ss');
}

const dataRecovery = async (data = []) => {
    queryDb.info("Data Recovery");
    if(consoleLog) console.log(data);
    try {
        for(let dat of data) {
            if(dat && dat.table && dat.data) {
                let action    = dat.action ?? 'update';
                let keysDat   = Object.keys(dat.data);
                let valuesDat = Object.values(dat.data);
                let id        = dat.data.ID ?? (dat.data.id ?? 0);

                if(action == 'update') {
                    // let dataType = await Model.model().query(`select DATA_TYPE, COLUMN_NAME from information_schema.columns where TABLE_NAME = '${dat.table}'`);
                    // console.log(dataType);
                    let valueUpdate = '';
                    for(let j = 0; j < keysDat.length; j++) {
                        if(keysDat[j] != 'ID' && keysDat[j] != 'id') {
                            let val = valuesDat[j];
                            if(val !== null) {
                                if(timeDb.indexOf(`${keysDat[j]}`) !== -1) {val = `'${convertTimeDb(valuesDat[j])}'`;}
                                else {val = `N'${valuesDat[j]}'`}
                            }
                            valueUpdate += `[${keysDat[j]}] = ${val}`;
                            if(j != keysDat.length - 1) valueUpdate += ', ';
                        }
                    }
                    if(id != 0) {
                        if(consoleLog) console.log(`update ${dat.table} set ${valueUpdate} where id = ${id}`);
                        await Model.model().query(`update ${dat.table} set ${valueUpdate} where id = ${id}`);
                    }
                } else if(action = 'delete') {
                    if(consoleLog) console.log(`delete ${dat.table} where id = ${id}`);
                    await Model.model().query(`delete ${dat.table} where id = ${id}`);
                }
            }
        }
    } catch(e) {
        if(consoleLog) console.log(`Error Recovery Data`, e);
        logger.error(`Error Recovery Data`, e);
    }
    
}

module.exports = {findClient, checkMacConfig, findIot, findMachine, findProduct, findClientLogout, checkPermission, emitFail, dataRecovery, emitPlan,findClientWithid};