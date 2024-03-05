'use strict'

require('dotenv').config({path: '../.env'});

const MasterMachine           = require('../app/models/MasterMachine');
const MachineProduction       = require('../app/models/MachineProduction');
const CommandProduction       = require('../app/models/CommandProduction');
const CommandProductionDetail = require('../app/models/CommandProductionDetail');
const { consoleLog }          = require('../config/app');
const { statusPlan } = require('../enums/status');

const delMachineProductionSuccessIsdelete = async () => {
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
                        // Lay KHSX da chay hoac da xoa
                        let listPlanSucAndDel = await CommandProductionDetail(trans).get({
                            where  : [`Machine_ID = ${machine.ID}`, `Command_ID = ${parent.ID}`, `(IsDelete = 1 or Status in (${statusPlan.end}))`],
                            select : [`ID`]
                        });

                        // Xoa KHSX Succsess and Delete
                        if(listPlanSucAndDel.length != 0) {
                            let planRunning = machineProductionFirst.Plan_Running.split('-').map(Number);

                            for(let i = 0; i < listPlanSucAndDel.length; i++) {
                                let find = planRunning.indexOf(Number(listPlanSucAndDel[i].ID));
                                if(find !== -1) {planRunning.splice(find, 1);}
                            }

                            await MachineProduction(trans).update({
                                where: [`ID = ${machineProductionFirst.ID ?? 0}`],
                                value: [`Plan_Running = '${planRunning.join('-').split('-').filter(n => n).join('-')}'`]
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
        console.log("Del Machine Production Success And Isdelete Success");
        trans.commit();
    } catch(e) {
        trans.rollback();
        console.log(e);
    }
    });
}

delMachineProductionSuccessIsdelete();
