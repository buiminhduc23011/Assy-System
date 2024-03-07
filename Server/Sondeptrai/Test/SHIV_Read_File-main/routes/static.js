'use strict'

const express = require('express')
,app = express()
,{cacheLifeTime, cwd} = require('../config/router');

app.use('/public', express.static(cwd + '/public', {maxAge: cacheLifeTime}));
app.use('/jquery', express.static(cwd + '/node_modules/jquery', {maxAge: cacheLifeTime}));
app.use('/jquery-easing', express.static(cwd + '/node_modules/jquery.easing', {maxAge: cacheLifeTime}));
app.use('/moment', express.static(cwd + '/node_modules/moment', {maxAge: cacheLifeTime}));
app.use('/bootstrap', express.static(cwd + '/node_modules/bootstrap', {maxAge: cacheLifeTime})); // bootstrap4
app.use('/datatables', express.static(cwd + '/node_modules/datatables', {maxAge: cacheLifeTime}));
app.use('/datatables.net-bs4', express.static(cwd + '/node_modules/datatables.net-bs4', {maxAge: cacheLifeTime}));
app.use('/fontawesome-free', express.static(cwd + '/node_modules/@fortawesome/fontawesome-free', {maxAge: cacheLifeTime}));

module.exports = app;