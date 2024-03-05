'use strict'

const Model = require('../../services/model');

const Users = () => {
    return {
        ...Model.model({
            table     : 'Users',
            created_at: 'Time_Created',
            updated_at: 'Time_Updated'
        })
    }
}

module.exports = Users;