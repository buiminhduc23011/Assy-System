'use strict'

const Model = require('../../services/model');

const CommandProduction = (trans = '') => {
    const fillable = [];

    return {
        ...Model.model({
            table     : 'Command_Production',
            created_at: 'time_created',
            updated_at: 'time_updated',
            fillable  : fillable,
            trans     : trans,
            timestamps: true,
        })
    }
}

module.exports = CommandProduction;