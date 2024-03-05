'use strict'

const Model = require('../../services/model');

const Schedule = (trans = '') => {
    const fillable = [
        'order_id',
        'date_job_gen',
        'qty',
        'status',
        'program',
        'time_created',
        'time_updated',
        'isdelete'
    ];

    return {
        ...Model.model({
            table     : 'schedule',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
        })
    }
}

module.exports = Schedule;