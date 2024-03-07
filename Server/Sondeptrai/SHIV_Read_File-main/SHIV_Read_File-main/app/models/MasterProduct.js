'use strict'

const Model = require('../../services/model');

const MasterProduct = (trans = '') => {
    return {
        ...Model.model({
            table     : 'Master_Product',
            created_at: 'Time_Created',
            updated_at: 'Time_Updated',
            trans     : trans
        })
    }
}

module.exports = MasterProduct;