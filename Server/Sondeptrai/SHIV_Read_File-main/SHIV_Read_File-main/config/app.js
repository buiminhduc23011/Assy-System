'use strict'

const debug = process.env.APP_DEBUG?.toLowerCase?.()   === 'true'  ? true : false
,callApi    = process.env.CALL_API?.toLowerCase?.()    === 'false' ? false: true
,consoleLog = process.env.CONSOLE_LOG?.toLowerCase?.() === 'true'  ? true : false
,queryLog   = process.env.QUERY_LOG?.toLowerCase?.() === 'true'  ? true : false
,machineSttLog   = process.env.MACHINE_STATUS_LOG?.toLowerCase?.() === 'true'  ? true : false
,timeoutRequest  = Number(process.env.TIMEOUT_REQUEST) ?? 1000
,timeoutMove     = Number(process.env.TIMEOUT_MOVE) ?? 14400000; // 4h

module.exports = {
    debug, callApi, consoleLog, queryLog, machineSttLog, timeoutRequest, timeoutMove
}