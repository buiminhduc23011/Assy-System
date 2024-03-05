'use strict'

const Model = require('../../services/model');

const ProcessMachine = (trans = '') => {
    const fillable = [
        'machine_id',
        'model',
        'rotor',
        'aixis',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'process_machine',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = ProcessMachine;