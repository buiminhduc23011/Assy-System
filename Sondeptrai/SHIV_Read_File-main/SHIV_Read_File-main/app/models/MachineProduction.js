'use strict'

const Model = require("../../services/model");

const MachineProduction = (trans = '') => {
    const fillable = [];

    return {
        ...Model.model({
            table     : 'Machine_Production',
            created_at: 'Time_Created',
            updated_at: 'Time_Updated',
            fillable  : fillable,
            trans     : trans,
            timestamps: true,
        })
    }
};

module.exports = MachineProduction;