'use strict'

const Model = require('../../services/model');

const MasterMachineStatus = (trans = '') => {
    const fillable = [
        'Name'
        ,'Type'
        ,'Error_Code'
        ,'Is_Running'
    ];

    return {
        ...Model.model({
            table     : 'Master_Machine_Status',
            fillable  : fillable,
            created_at: 'Time_Created',
            updated_at: 'Time_Updated',
            trans     : trans,
        })
    }
}

module.exports = MasterMachineStatus;