'use strict'

const Model = require('../../services/model');

const MasterMachine = (trans = '') => {
    const fillable = [
        'machine_name',
        'machine_symbols',
        'mac',
        'isdelete',
        'isconnected',
    ];

    return {
        ...Model.model({
            table     : 'master_machine',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = MasterMachine;