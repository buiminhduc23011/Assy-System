'use strict'

const Model = require('../../services/model');

const MasterAxis = (trans = '') => {
    const fillable = [
        'symbols_pid',
        'name_pid',
        'time_created',
        'time_updated',
        'user_created',
        'isdelete',
        'user_updated',
    ];

    return {
        ...Model.model({
            table     : 'master_axis',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = MasterAxis;