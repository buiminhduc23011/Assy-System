'use strict'

require('dotenv').config({path: '../.env'});

const MasterMachine           = require('../app/models/MasterMachine');
const MachineProduction       = require('../app/models/MachineProduction');
const CommandProduction       = require('../app/models/CommandProduction');
const CommandProductionDetail = require('../app/models/CommandProductionDetail');
const { consoleLog }          = require('../config/app');
const { statusPlan } = require('../enums/status');

const delLotNumberMultiple = async () => {
    let trans = await MasterMachine().transaction();
    trans.begin(async() => { 
    try {
        // Lay all KHSX trung
        let listPlanMultiple = await CommandProductionDetail(trans).query(
            `select count(Lot_Number) as cnt, Lot_Number, Type, Process from Command_Production_Detail where IsDelete = 0 and Status != ${statusPlan.end} group by Lot_Number, Type, Process having count(Lot_Number) > 1`
        );
        if(listPlanMultiple.length != 0) {
            for(let i = 0; i < listPlanMultiple.length; i++) {
                let multipleLast = await CommandProductionDetail(trans).get({
                    where  : [`Lot_Number = '${listPlanMultiple[i].Lot_Number}'`, `IsDelete = 0`, `Status != ${statusPlan.end}`],
                    select : ['ID'],
                    orderBy: ['ID asc']
                });

                let arrDel = [];
                for(let i = 0; i < multipleLast.length; i++) {if (i != 0) arrDel.push(Number(multipleLast[i].ID));}
                if(arrDel.length)
                    await CommandProductionDetail(trans).update({
                        where: [`ID in (${arrDel})`],
                        value: [`IsDelete = 1`, 'User_Updated = 2']
                    });
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

delLotNumberMultiple();
