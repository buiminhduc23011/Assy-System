'use strict'

const Model = require('../../services/model');

const AssyProduction = (trans = '') => {
    const fillable = [
        'machine_id',
        'article_id',
        'frame_id',
        'order_id',
        'qty',
        'status',
        'time_created',
        'time_updated',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'assy_production',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
            timestamps: true,
        })
    }
}

module.exports = AssyProduction;