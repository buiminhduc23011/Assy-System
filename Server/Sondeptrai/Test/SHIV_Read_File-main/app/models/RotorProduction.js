'use strict'

const Model = require('../../services/model');

const RotorProduction = (trans = '') => {
    const fillable = [
        'machine_id',
        'order_id',
        'tray_id',
        'rotor_id',
        'truc_id',
        'qty',
        'status',
        'qty_production',
        'user_created',
        'time_created',
        'user_updated',
        'time_updated',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'rotor_production',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = RotorProduction;