'use strict';

const log4js = require('log4js');
const logDefault = {
    appenders: {
        multi: {
            type: 'multiFile',
            base: 'storage/logs/', // Forder log
            property: 'categoryName',
            extension: '.log', // File name extension
            maxLogSize: 1048576000, // 1000MB
        },
    },
    categories: {
        default: { appenders: ['multi'], level: 'debug' },
    },
};

const optionLog = (url = 'storage/logs/server.log', size = 10, backups = 2, numBackups = 3) => {
    return {
        type                : 'dateFile',
        pattern             : "yyyy-MM-dd",
        keepFileExt         : true, //
        maxLogSize          : 1024 * 1024 * Number(size), //1024 * 1024 * size = size M
        backups             : backups, //
        alwaysIncludePattern: true,//
        numBackups          : numBackups, // So file luu giu trong 1 ngay
        filename            : `${url}`,
    }
}

const logDayly = {
    appenders: {
        default            : optionLog('storage/logs/server.log'),
        connectLog         : optionLog('storage/logs/socketio/connect-log.log'),
        disconnectLog      : optionLog('storage/logs/socketio/disconnect-log.log'),
        callApiLog         : optionLog('storage/logs/plans/call-api-log.log'),
        queryDbLog         : optionLog('storage/logs/query-db-log.log'),
        performanceMachine : optionLog('storage/logs/plans/performance-machine.log'),
        machineStatus      : optionLog('storage/logs/masterdata/machine/status/machine-status-log.log'),
        machineOutput      : optionLog('storage/logs/masterdata/machine/output/machine-output-log.log'),
        machineError       : optionLog('storage/logs/masterdata/machine/error/machine-error-log.log'),
        machineOutputNg    : optionLog('storage/logs/masterdata/machine/outputng/machine-output-ng-log.log'),
    },
    categories: {
        default             : {appenders: ["default"],level: "ALL"},
        connectLog          : {appenders: ["connectLog"],level: "ALL"},
        disconnectLog       : {appenders: ["disconnectLog"],level: "ALL"},
        callApiLog          : {appenders: ["callApiLog"],level: "ALL"},
        queryDbLog          : {appenders: ["queryDbLog"],level: "ALL"},
        machineStatus       : {appenders: ["machineStatus"],level: "ALL"},
        performanceMachine  : {appenders: ["performanceMachine"],level: "ALL"},
        machineOutput       : {appenders: ["machineOutput"],level: "ALL"},
        machineError        : {appenders: ["machineError"],level: "ALL"},
        machineOutputNg     : {appenders: ["machineOutputNg"],level: "ALL"},
    }
}

log4js.configure(logDayly);
  
global.logger = log4js.getLogger();
// logger.debug('I will be logged in storage/logs/server.log');
// logger.info('I will be logged in storage/logs/server.log');
// logger.error('I will be logged in storage/logs/server.log');
global.connectLog = log4js.getLogger('connectLog');
// connectLog.debug('Cheese is cheddar - this will be logged in storage/logs/connect-log.log');
// connectLog.info('Cheese is cheddar - this will be logged in storage/logs/connect-log.log');
// connectLog.error('Cheese is cheddar - this will be logged in storage/logs/connect-log.log');
global.disconnectLog = log4js.getLogger('disconnectLog');
// disconnectLog.debug('Cheese is cheddar - this will be logged in storage/logs/disconnect-log.log');
// disconnectLog.info('Cheese is cheddar - this will be logged in storage/logs/disconnect-log.log');
// disconnectLog.error('Cheese is cheddar - this will be logged in storage/logs/disconnect-log.log');
global.callApiLog = log4js.getLogger('callApiLog');
// callApiLog.debug('Cheese is cheddar - this will be logged in storage/logs/call-api-log.log');
// callApiLog.info('Cheese is cheddar - this will be logged in storage/logs/call-api-log.log');
// callApiLog.error('Cheese is cheddar - this will be logged in storage/logs/call-api-log.log');
global.queryDb = log4js.getLogger('queryDbLog');
// queryDb.debug('Cheese is cheddar - this will be logged in storage/logs/query-db-log.log');
// queryDb.info('Cheese is cheddar - this will be logged in storage/logs/query-db-log.log');
// queryDb.error('Cheese is cheddar - this will be logged in storage/logs/query-db-log.log');
global.machineStatusLog = log4js.getLogger('machineStatus');
// machineStatusLog.debug('Cheese is cheddar - this will be logged in storage/logs/machine-status.log');
// machineStatusLog.info('Cheese is cheddar - this will be logged in storage/logs/machine-status.log');
// machineStatusLog.error('Cheese is cheddar - this will be logged in storage/logs/machine-status.log');
global.performanceMachineLog = log4js.getLogger('performanceMachine');
// performanceMachineLog.debug('Cheese is cheddar - this will be logged in storage/logs/performance-machine.log');
// performanceMachineLog.info('Cheese is cheddar - this will be logged in storage/logs/performance-machine.log');
// performanceMachineLog.error('Cheese is cheddar - this will be logged in storage/logs/performance-machine.log');
global.machineOutputLog = log4js.getLogger('machineOutput');
// machineOutputLog.debug('Cheese is cheddar - this will be logged in storage/logs/masterdata/machine-output-log.log');
// machineOutputLog.info('Cheese is cheddar - this will be logged in storage/logs/masterdata/machine-output-log.log');
// machineOutputLog.error('Cheese is cheddar - this will be logged in storage/logs/masterdata/machine-output-log.log');
global.machineErrorLog    = log4js.getLogger('machineError');
global.machineOutputNgLog = log4js.getLogger('machineOutputNg');