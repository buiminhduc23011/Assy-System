'use strict'

const Controller = require('../Controller');
const LoginHistory = require('../../models/LoginHistory');
const CommandProductionDetail = require('../../models/CommandProductionDetail')
const moment = require('moment/moment');

const insertLoginHistory = async (msg = []) => {
    try {
        let username = msg.username;
        let password = msg.password;
        let mac = getMac(msg);

        if (mac === '' || mac === undefined) {
            logger.error(`Không Tồn Tại MAC`);
            return false;
        }

        if (username === '' || username === undefined) {
            logger.error(`Không Tồn Tại Username`);
            return false;
        }

        if (password === '' || password === undefined) {
            logger.error(`Không Tồn Tại Password`);
            return false;
        }

        // Tim kiem user trong listClients
        let client  = await Controller.findClient(mac);
        let machine = await Controller.findMachine(mac);

        if (client.status && machine.status) {
            let finHistory = await LoginHistory().count({
                where: [`User_ID = ${client.data.userId} and Machine_ID = ${machine.data.ID} and Is_Current = 'true'`]
            });

            if (finHistory == 0)
                await LoginHistory().query(`
                    insert into Login_History (User_ID,Date_Created,Date_Updated,Time_Created,Time_Updated,Is_Current,Machine_ID) values
                    (${client.data.userId},'${moment().format('YYYY-MM-DD')}', '${moment().format('YYYY-MM-DD')}', '${moment().format('HH:mm:ss')}', '${moment().format('YYYY-MM-DD')}', 'true', ${machine.data.ID})
                `);
        } else
            logger.error(!client.status ? `Không Tồn Tại Username Có MAC ${getMac(msg)}` : `Không Tồn Tại Máy Có MAC ${getMac(msg)}`);
        return true;
    } catch (e) {
        logger.error("Error Insert User Login", e);
    }
};

// update quantity at end plan or logout
const updateQuantityPlan = async (msg = []) => {
    try {
        let plan = await CommandProductionDetail().first({
            where: [`ID = ${msg.planId}`, `IsDelete = 0`, `Type = 1`, `Status != 1`],
        });
        let quantity_schedule = plan.Quantity_Schedule;
        let qtyNgSum = await CommandProductionDetail().query(`select sum(Quantity) as sum_qty from Machine_Output where Machine_ID = ${plan.Machine_ID} and Command_Production_Detail_ID = ${plan.ID} and Error_ID != 0`);
        let qtyNgTotal = Number(qtyNgSum[0].sum_qty);
        let qtyTotal = msg.Qty_Real + qtyNgTotal;

        if (qtyTotal > quantity_schedule) {
            Controller.emitFail(socket, 'plan', "Số Lượng Cần Sản Xuất Phải Nhỏ Hơn Hoặc Bằng Số Lượng Kế Hoạch");
            if (consoleLog) console.log(`${machine.data.Name} Số Lượng Cần Sản Xuất Phải Bằng Số Lượng Kế Hoạch`);
            return;
        }

        let mac = getMac(msg);
        let client = await Controller.findClient(mac);

        if (client.status) {
            await CommandProductionDetail().update({
                where: [`ID = ${plan.ID}`],
                value: [`Quantity_Real = ${qtyTotal}`, `Quantity_Insert = ${qtyTotal}`]
            });
            listClients[client.pos].qty = qtyTotal;
            if (consoleLog) console.log('quantity-real', dataOutput);
            if (machineSttLog) machineOutputLog.info(JSON.stringify(dataOutput));
        }
        return true;
    } catch (e) {
        logger.error("Error status", e);
        return false;
    }
}

// const saveQuantityPlan = async(msg = []) => {
//     if(client.data.Quantity_Real){
//         let qtyPlan = Number(client.data.qtyPlan) + parseFloat(cnt);
//         let qtyReal   = Number(qtyPlan.toFixed(0));

//         await CommandProductionDetail().update({
//             where: [`ID = ${client.data.planId}`],
//             value: [`Quantity_Real = ${qtyReal}`, `Capacity = ${cnt}`]
//         });

//         for(let i = 0; i < Quantity_Real.length; i++) {
//             qtyReal.push({
//                 table: CommandProductionDetail().getTable(),action:'update',
//                 data : Quantity_Real[i]
//             });
//         }
//         __io.to('notification').emit('btn-save', dataOutput);
//         if(consoleLog) console.log('btn-save', dataOutput);
//         if(machineSttLog) machineOutputLog.info(JSON.stringify(dataOutput));
//     }
// }

// Update User Login History
const updateLoginHistory = async (msg = []) => {
    try {
        let username = msg.username;
        let password = msg.password;
        let mac = getMac(msg);

        if (mac === '' || mac === undefined) {
            logger.error(`Không Tồn Tại MAC`);
            return false;
        }

        if (username === '' || username === undefined) {
            logger.error(`Không Tồn Tại Username`);
            return false;
        }

        if (password === '' || password === undefined) {
            logger.error(`Không Tồn Tại Password`);
            return false;
        }

        let client = await Controller.findClient(mac);
        let machine = await Controller.findMachine(mac);

        if (client.status && machine.status)
            if (Number(client.data.userId) !== 0)
                await LoginHistory().query(`
                    update Login_History set [Date_Updated] = '${moment().format('YYYY-MM-DD')}',[Time_Updated] = '${moment().format('HH:mm:ss')}',[Is_Current] = 'false'
                    where User_ID = ${client.data.userId} and Machine_ID = ${machine.data.ID} and Is_Current = 'true'
                `);
            else
                logger.error(!client.status ? `Không Tồn Tại Username Có MAC ${getMac(msg)}` : `Không Tồn Tại Máy Có MAC ${getMac(msg)}`);
        return true;
    } catch (e) {
        logger.error("Error Insert User Login", e);
    }
};

const logoutAllUser = async () => {
    try {
        await LoginHistory().query(`update Login_History set Is_Current = 'false' where Is_Current = 'true'`)
    } catch (err) {
        logger.error("logoutAllUser", err)
    }
}

module.exports = {
    insertLoginHistory,
    updateLoginHistory,
    updateQuantityPlan,
    logoutAllUser
}