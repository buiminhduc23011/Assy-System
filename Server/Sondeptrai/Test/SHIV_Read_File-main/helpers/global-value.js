'use strict'

global.listUsers      = [];
global.listClients    = [];
global.data_read_file = [];
global.data_cardno = [];
global.array_read_file = [];
global.data_machine    = [];
global.data_axis   = [];
global.timeout_read_file   = 120000;
global.listLogouts    = [];
global.listMachine    = [];
global.listMold       = [];
global.listProduct    = [];
global.listMaterials  = [];
global.listMasterBom  = [];
global.dbo            = process.env.DB_CONNECTION == 'sql' ? '.dbo' : '';
global.db_database    = process.env.DB_DATABASE;
global.moment         = require('moment');
global.listPermission = [];
global.listGroupPermission = [];
global.listTimeoutMachine  = [];
global.myDelay       = function(time){return new Promise((suc, err) => {setTimeout(() => {suc();}, time)});}