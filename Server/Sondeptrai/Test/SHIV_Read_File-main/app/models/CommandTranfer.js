'use strict'

const Model = require('../../services/model');

const CommandTranfer = (trans = '') => {
    const fillable = [
        'machine_id',
        'transit_car_id',
        'conveyor_id',
        'rotor_id',
        'status',
        'type',
        'user_created',
        'time_created',
        'user_updated',
        'time_updated',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'command_tranfer',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = CommandTranfer;