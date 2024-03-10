'use strict'

module.exports = {};


if(process.env.APP_DEBUG == 'false') {process.env.NODE_ENV='production'}

const portExpress = process.env.PORT || (process.env.PORT_EXPRESS || 3000)
,cors =  {origin: '*'}
,cwd  = process.cwd()
,cacheLifeTime = Number(process.env.CACHE_LIFETIME || 3600)*1000
,pingTimeout   = Number(process.env.PING_TIMEOUT || 20000)
,pingInterval  = Number(process.env.PING_INTERVAL || 25000)
,iotServices   = process.cwd() + '/public/iot_services'
,serverOee     = process.env.SERVER_OEE
,serverPlan    = process.env.SERVER_PLAN
,maxSizeUpload = (process.env.MAX_SIZE_UPLOAD || 1000)* 1 * 1000; // MB

module.exports = {
	portExpress, cors, cwd, maxSizeUpload, cacheLifeTime, iotServices, serverOee, serverPlan, pingTimeout, pingInterval
};