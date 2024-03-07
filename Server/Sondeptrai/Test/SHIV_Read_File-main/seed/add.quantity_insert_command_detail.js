'use strict'

require('dotenv').config({path: '../.env'});

const MasterMachine           = require('../app/models/MasterMachine');
const MachineProduction       = require('../app/models/MachineProduction');
const CommandProduction       = require('../app/models/CommandProduction');
const CommandProductionDetail = require('../app/models/CommandProductionDetail');
const {statusPlan}            = require('../enums/status');

const addQuantityInsertCommandDetail = async () => {
    let trans = await MasterMachine().transaction();
    trans.begin(async() => { 
    try {
        let listIdCommandDetail = await CommandProductionDetail(trans).get({
            where : [`IsDelete = 0`, `Status = ${statusPlan.start}`],
            select: ['ID', 'Quantity_Real']
        });

        for(let detail of listIdCommandDetail) {
            await CommandProductionDetail(trans).update({
                where: [`ID = ${detail.ID}`],
                value: [`Quantity_Insert = ${detail.Quantity_Real}`]
            });
        }

        console.log("Add Quantity Insert Command Detail Success");
        trans.commit();
    } catch(e) {
        trans.rollback();
        console.log(e);
    }
    });
}

addQuantityInsertCommandDetail();
