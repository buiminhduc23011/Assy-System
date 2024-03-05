'use strict'
const sql     = require('mssql');
const config  = require('../config/database');
const {debug, consoleLog, queryLog} = require('../config/app');

const timeNow = () => {
    let datetime = new Date();
    let year     = datetime.getFullYear();
    let month    = datetime.getMonth() + 1;
    let day      = datetime.getDate();
    let hours    = datetime.getHours();
    let minutes  = datetime.getMinutes();
    let seconds  = datetime.getSeconds();
    
    let monthFull   = month.toString().length != 2   ? `0${month}`  : month;
    let dayFull     = day.toString().length != 2     ? `0${day}`    : day;
    let hoursFull   = hours.toString().length != 2   ? `0${hours}`  : hours;
    let minutesFull = minutes.toString().length != 2 ? `0${minutes}`: minutes;
    let secondsFull = seconds.toString().length != 2 ? `0${seconds}`: seconds;

    return `${year}-${monthFull}-${dayFull} ${hoursFull}:${minutesFull}:${secondsFull}`;
}

let params = {
    connection: process.env.DB_CONNECTION || 'sql',
    database  : process.env.DB_DATABASE,
    // timestamps: true,
    // created_at: {
    //     name: 'created_at',
    //     // time: timeNow()
    // },
    // updated_at:  {
    //     name: 'updated_at',
    //     // time: timeNow()
    // },
}

const dbo = params.connection == 'sql' ? '.dbo' : '';

const connection = (connection = params.connection) => {
    return params.connection = connection;
}

const database = (database = params.database) => {
    return params.database = database;
}

const limit = (request = []) => {
    return request.limit ?? 10000;
}

const limitFirst = (request = []) => {
    return request.limit ?? 1;
}

const offset = (request = []) => {
    return request.offset ?? 0;
}

const select = (request = []) => {
    return request.select ?? '*';
}

const where = (request = []) => {
    if(!request.where) return '';
    let val = 'where ';
    for(let i = 0; i < request.where.length; i++)
    {
        val += request.where[i].toString();
        if(i != request.where.length - 1) val += ' and ';
    }
    return val;
}

const orWhere = (request = []) => {
    if(!request.orWhere) return '';
    let val = 'or (';
    for(let i = 0; i < request.orWhere.length; i++)
    {
        val += request.orWhere[i].toString();
        if(i != request.orWhere.length - 1) val += ' and ';
    }
    return val+')';
}

const orderBy = (request = []) => {
    try {
        let order = '';
        for(let i = 0; i < request.orderBy.length; i++) {
            order += `${request.orderBy[i]}`;
            if(i != request.orderBy.length - 1) order += ', ';
        }
        return order ?? 'id asc';
    } catch(e) {
        return 'id asc';
    }
    
}

const sortBy = (request = []) => {
    return request.sortBy ?? 'asc';
}

const typeString = ['nvarchar', 'char', 'varchar', 'text'];

const value = (fillable = [], request = [], dataType = [], timestamps = true) => {
    let val = '';
    if(request.length >= 1 && fillable.length >= 1) {
        for(let i = 0; i < request.length; i++) {
            let fill = '';

            for(let j = 0; j < fillable.length; j++) {
                if(request[i][`${fillable[j]}`] != undefined) {
                    let str = false;
                    for(let k = 0; k < dataType.length; k++) {
                        if(dataType[k].COLUMN_NAME.toUpperCase() == fillable[j].toUpperCase()) {
                            if(typeString.indexOf(dataType[k].DATA_TYPE.toLowerCase()) !== -1) {str = true; break;}
                            else break;
                        }
                    }
                    fill += `${str ? `N` : ``}'${request[i][`${fillable[j]}`]}',`;
                }
            }

            if(fill != '') {
                // if(consoleLog) console.log(params)
                // Add time created_at and updated_at
                if(timestamps) 
                    fill += `'${timeNow()}', '${timeNow()}'`;
                // Add "," or not ","
                if(i == request.length - 1){val += `(${fill})`;} else {val += `(${fill}),`;}
            }
        }
    }
    return val.replace(',)', ')');
}

const seted = (request = [], isDelete = 0, timestamps = true, updated_at = 'updated_at') => {
    if(!request.value && !isDelete) return '';
    let isDel = '';
    if(isDelete) isDel = ', IsDelete = 1';

    if(!timestamps) {
        if(isDel !== '') {
            if(request.value.length != 0) {
                request.value.push(`${isDel}`);
            } else {
                request.value.push(`${isDel.slice(1)}`);
            }
        }
            
    } else {
        request.value.push(`[${updated_at}] = '${timeNow()}' ${isDel}`);
    }
    // if(consoleLog) console.log(request.value)
    return request.value.toString();
}

const fillableVal = (fillable = [], request = []) => {
    let val = [];
    
    for(let i = 0; i < request.length; i++)
    {
        for(let j = 0; j < fillable.length; j++)
        {
            if(request[i][`${fillable[j]}`] != undefined && val.indexOf(`[${fillable[j]}]`) === -1) val.push(`[${fillable[j]}]`);
        }
    }
    // if(consoleLog) console.log(val);
    return val;
}

const model = (constructor = {
    trans     : '',
    table     : '',
    fillable  : [],
    timestamps: true,
    created_at: 'created_at',
    updated_at: 'updated_at'
}) => {
    let _trans      = constructor.trans ?? '';
    let _table      = constructor.table ?? '';
    let _fillable   = constructor.fillable ?? [];
    let _timestamps = constructor.timestamps ?? true;
    let _created_at = constructor.created_at ?? 'created_at';
    let _updated_at = constructor.updated_at ?? 'updated_at';

    const query = async (query) => {
        try {
            // if(consoleLog) console.log(query);
            if(!_trans) await sql.connect(config.sqlConfig);
            let data = await new sql.Request(_trans).query(query);
            return new Promise((success, error) => {success(data.recordset ?? data);});
            // return data.recordset ?? data;
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query", e);
            else console.log("Error Query", e);
            throw new Error(e);
        }
    }

    const transaction = async () => {
        await sql.connect(config.sqlConfig);
        return new sql.Transaction();
    }

    const closeConnect = async () => {
        return await sql.close();
    }

    const getTable = () => {
        return _table;
    }

    const getTypeData = async () => {
        try {
            let res = `select DATA_TYPE, COLUMN_NAME from information_schema.columns where TABLE_NAME = '${_table}' and TABLE_CATALOG = '${params.database}'`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            let dataType = await query(res);
            return dataType;
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Get Type Data", e);
            else console.log("Error Get Type Data", e);
            throw new Error(e);
        }
        
    }
    // select: [], where: [], orWhere: [], orderBy: int, sortBy: string, offset: int, limit: int
    const get = async (request = []) => {
        try {
            let res = `select ${select(request)} from ${params.database}${dbo}.${_table}
                        ${where(request)} ${orWhere(request)}
                        order by ${orderBy(request)}
                        offset ${offset(request)} row 
                        fetch next ${limit(request)} row only;`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            return await query(res);
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query Get", e);
            else console.log("Error Query Get", e);
            throw new Error(e);
        }
    }
    // select: [], where: [], orWhere: [], orderBy: int, sortBy: string, offset: int, limit: int
    const first = async (request = []) => {
        try {
            let res = `select ${select(request)} from ${params.database}${dbo}.${_table}
                            ${where(request)} ${orWhere(request)}
                            order by ${orderBy(request)}
                            offset ${offset(request)} row 
                            fetch next ${limitFirst(request)} row only;`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            let que = await query(res);
            return que[0] ?? null;
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query First", e);
            else console.log("Error Query First", e);
            throw new Error(e);
        }
    }
    // select: [], where: [], orWhere: [], orderBy: int, sortBy: string, offset: int, limit: int, fillableVal: [], value: []
    const insert = async (request = []) => {
        try {
            let dataType = [];
            if(params.connection == 'sql') dataType = await getTypeData();

            let res = `insert into ${params.database}${dbo}.${_table}
                        (${fillableVal(_fillable, request)} ${_timestamps ? `, [${_created_at}], [${_updated_at}]` : ''}) 
                        values ${value(_fillable, request, dataType, _timestamps)};`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            return await query(res);
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query Insert", e);
            else console.log("Error Query Insert", e);
            throw new Error(e);
        }
    }
    // select: [], where: [], orWhere: [], orderBy: int, sortBy: string, offset: int, limit: int, fillableVal: [], value: [], seted: []
    const update = async (request = []) => {
        try {
            let res = `update ${params.database}${dbo}.${_table} 
                            set ${seted(request, 0, _timestamps, _updated_at)} ${where(request)} ${orWhere(request)};`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            return await query(res);
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query Update", e);
            else console.log("Error Query Update", e);
            throw new Error(e);
        }
    }
    // select: [], where: [], orWhere: [], orderBy: int, sortBy: string, offset: int, limit: int, fillableVal: [], value: [], seted: []
    const isDelete = async (request = []) => {
        try {
            if(request.value == undefined) request.value = [];       

            let res = `update ${params.database}${dbo}.${_table} 
                            set ${seted(request, 1, _timestamps, _updated_at)} ${where(request)} ${orWhere(request)};`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            return await query(res);
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query IsDelete", e);
            else console.log("Error Query IsDelete", e);
            throw new Error(e);
        }
    }
    // select: [], where: [], orWhere: [], orderBy: int, sortBy: string, offset: int, limit: int, fillableVal: [], value: [], seted: [], count: string
    const count = async (request = []) => {
        try {
            let cnt = `${request['count'] ?? 'id'}_sum`;
            let res = `select count(${request['count'] ?? '*'}) as ${cnt} from ${params.database}${dbo}.${_table} ${where(request)} ${orWhere(request)};`;
            if(queryLog) if(typeof queryDb !== 'undefined') queryDb.info(res);
            if(consoleLog) console.log(res);
            let que = await query(res);
            return que[0][`${cnt}`] ?? 0;
        } catch(e) {
            if(typeof logger !== 'undefined') logger.error("Error Query Count", e);
            else console.log("Error Query Count", e);
            throw new Error(e);
        }
    }

    return {
        query,
        transaction,
        get,
        first,
        insert,
        update,
        isDelete,
        count,
        closeConnect,
        getTable
    }
}

module.exports = {
    sql, model, database, connection
}