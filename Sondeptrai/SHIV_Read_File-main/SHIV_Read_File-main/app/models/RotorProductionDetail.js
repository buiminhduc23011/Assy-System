'use strict'

const Model = require('../../services/model');

const RotorProductionDetail = (trans = '') => {
    const fillable = [
        'rotor_production_id',
        'height',
        'status',
        'user_created',
        'time_created',
        'user_updated',
        'time_updated',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'rotor_production_detail',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = RotorProductionDetail;