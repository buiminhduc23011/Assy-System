'use strict'

const Model = require('../../services/model');

const AssyProductionDetail = (trans = '') => {
    const fillable = [
        'assy_production_id',
        'card_no',
        'product_id',
        'height',
        'depth',
        'flatness',
        'status',
        'time_created',
        'time_updated',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'assy_production_detail',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
            timestamps: true,
        })
    }
}

module.exports = AssyProductionDetail;