'use strict'

const Model = require('../../services/model');

const AmountOfJobGen = (trans = '') => {
    const fillable = [
        'file_name',
        'order_rotor_id',
        'article_rotor',
        'rotor_order_quantity',
        'order_stator_id',
        'article_stator',
        'stator_order_quantity',
        'order_coil_id',
        'article_coil',
        'rotor_coil_quantity',
        'order_motor_id',
        'article_motor',
        'decription_motor',
        'motor_order_quantity',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'amount_of_job_gen',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = AmountOfJobGen;