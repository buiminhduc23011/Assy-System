'use strict'

const Model = require('../../services/model');

const CommandProductionDetail = (trans = '') => {
    const fillable = [
        'Symbols',
        'Command_ID',
        'Machine_ID',
        'Product_ID',
        'Quantity_Schedule',
        'Process_Number',
        'Process',
        'Lot',
        'Lot_Number',
        'Quantity_Sum',
        'Charge',
        'Materials',
        'Cycletime',
        'Time_Mounting',
        'Time_Setup',
        'Time_Check',
        'Color',
        'New',
        'Watting',
        'Minutes_Production',
        'STT_Lot',
        'Time_Schedule_Start',
        'Time_Schedule_End',
        'Time_Real_Start',
        'Time_Real_End',
        'Quantity_Real',
        'Quantity_Insert',
        'Error',
        'Status',
        'Type',
        'Note',
        'User_Created',
        'User_Updated',
        'Capacity'
    ];

    return {
        ...Model.model({
            table     : 'Command_Production_Detail',
            created_at: 'Time_Created',
            updated_at: 'Time_Updated',
            fillable  : fillable,
            trans     : trans,
            timestamps: true,
        })
    }
}

module.exports = CommandProductionDetail;