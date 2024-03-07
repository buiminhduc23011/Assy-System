const winston = require('winston')
require('winston-daily-rotate-file')
const moment = require('moment')

const createLogger = (name, path, maxFiles = '30d', maxSize = '10m') => winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: `${process.cwd()}${path}/${name}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            maxFiles,
            maxSize,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: () => moment().format('YYYY-MM-DD HH:mm:ss')
                }),
                winston.format.json()
            )
        })
    ]
})

module.exports = {
    loginLogger: createLogger('login-history', '/logs/user', null)
}