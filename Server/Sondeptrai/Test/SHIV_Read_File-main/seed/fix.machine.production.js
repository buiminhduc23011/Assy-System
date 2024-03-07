'use strict'

require('dotenv').config({path: '../.env'});

const MasterMachine           = require('../app/models/MasterMachine');
const MachineProduction       = require('../app/models/MachineProduction');
const CommandProduction       = require('../app/models/CommandProduction');
const CommandProductionDetail = require('../app/models/CommandProductionDetail');
const { consoleLog }          = require('../config/app');

const fixMachineProduction = async () => {
    let trans = await MasterMachine().transaction();
    trans.begin(async() => { 
    try {
        let machines = await MasterMachine(trans).get({
            where: [`IsDelete = 0`],
            select: ['ID', 'Name']
        });

        let listCommandParent = await CommandProduction(trans).get({
            where : [`IsDelete = 0`],
            select: ['ID']
        });
        for(let parent of listCommandParent) {
            // Ktra KHSX chi tiet đã có KHSX nào chạy chưa
            let command = await CommandProductionDetail(trans).count({
                where: [`Command_ID = ${parent.ID}`, `Status != 1`]
            });
            // Neu trong dang sach KHSX chua cos KHSX nao chay thi bo qua
            if(command == 0) continue;
            for(let machine of machines) {
                if(machine.ID) {
                    let machineProductionFirst = await MachineProduction(trans).first({
                        where  : [`Machine_ID = ${machine.ID}`, `IsDelete = 0`, `Command_ID = ${parent.ID}`],
                        orderBy: ['ID desc']
                    });

                    if(machineProductionFirst) {
                        // Lay KHSX da chay sap xep theo thoi gian ket thuc KHSX
                        let listPlanRunning = await CommandProductionDetail(trans).get({
                            where  : [`Machine_ID = ${machine.ID}`, `IsDelete = 0`, `Time_Real_End is not null`, `Command_ID = ${parent.ID}`],
                            orderBy: [`Time_Real_End asc`]
                        });
                
                        let arrPlan = [];
                        for(let i = 0; i < listPlanRunning.length; i++) {arrPlan.push(listPlanRunning[i].ID);}
                        // Lay KHSX cung lot
                        let planRunningLast = arrPlan[arrPlan.length - 1];
                        if(planRunningLast) {
                            let planDetail = await CommandProductionDetail(trans).first({
                                where: [`ID = ${planRunningLast}`]
                            });

                            let listPlanTogetherLot = await CommandProductionDetail(trans).get({
                                where: [`Command_ID = ${parent.ID}`, `Symbols = N'${planDetail.Symbols}'`, `Lot = N'${planDetail.Lot}'`, `Process = N'${planDetail.Process}'`, `Machine_ID = ${planDetail.Machine_ID}`, 'IsDelete = 0'],
                                orderBy: [`STT_Lot asc`, `ID asc`],
                                select: ['ID']
                            });

                            for(let i = 0; i < listPlanTogetherLot.length; i++) {
                                if(arrPlan.indexOf(listPlanTogetherLot[i].ID) === -1)
                                    arrPlan.push(listPlanTogetherLot[i].ID);
                            }

                            // Lay tat ca KHSX con lai
                            let listPlanNotRun = await CommandProductionDetail(trans).get({
                                where: [`Command_ID = ${parent.ID}`, `Machine_ID = ${machine.ID}`, `IsDelete = 0`, `Time_Real_End is null`],
                                orderBy: [`ID asc`],
                                select: ['ID']
                            });

                            for(let i = 0; i < listPlanNotRun.length; i++) {
                                if(arrPlan.indexOf(listPlanNotRun[i].ID) === -1)
                                    arrPlan.push(listPlanNotRun[i].ID);
                            }

                            let planRunningNewUpdate = arrPlan;
                            if(consoleLog) console.log(planRunningNewUpdate.join('-'));
                            await MachineProduction(trans).update({
                                where: [`ID = ${machineProductionFirst.ID ?? 0}`],
                                value: [`Plan_Running = '${planRunningNewUpdate.join('-').split('-').filter(n => n).join('-')}'`]
                            });
                            console.log(`Máy ${machine.Name} Cập Nhật KHSX Hoàn Thiện!`);
                        } else {
                            console.log(`Máy ${machine.Name} Chưa Chạy KHSX!`);
                        }
                    }
                    else {console.log(`Máy ${machine.Name} Không Có KHSX!`); continue;}
                }
            }
        }
        console.log("Fix Machine Production Success");
        trans.commit();
    } catch(e) {
        trans.rollback();
        console.log(e);
    }
    });
}

fixMachineProduction();
