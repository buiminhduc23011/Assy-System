'use strict'

const Model = require("../../services/model");

const LoginHistory = (trans = '') => {
    const fillable = [
        'User_ID'
        ,'Date_Created'
        ,'Date_Updated'
        ,'Time_Created'
        ,'Time_Updated'
        ,'Is_Current'
        ,'Machine_ID'
    ];

    return {
        ...Model.model({
            table     : 'Login_History',
            created_at: 'Time_Created',
            updated_at: 'Time_Updated',
            fillable  : fillable,
            trans     : trans,
            timestamps: true,
        })
    }
};

module.exports = LoginHistory;