'use strict'
const fs = require('fs');
const util =  require('util');
const fs_promises = require('fs/promises');
const { consoleLog, machineSttLog } = require('../../../config/app');
const Controller = require('../Controller');
const AmountOfJobGen = require('../../models/AmountOfJobGen');
const Schedule = require('../../models/Schedule');
const url  = require('url');
const moment = require('moment');
const { mkdir } = require('fs/promises');
const chokidar = require("chokidar");
const env = require('dotenv').config();
const fsExtra = require("fs-extra");
var url_file_delivery = env.parsed.URL_DELIVERY;
var url_file_bom = env.parsed.URL_BOM;
var url_file_cardno = env.parsed.URL_CARD_NO;
var file_old = '';
var khoi_tao = true;
var read_file_khoi_tao = 0;
var count_file_khoi_tao = 0;

var data_acticle = [];
var list_file_bom = [];
const AssyProduction = require('../../models/AssyProduction');
const path = require('path');

const count_file = async () => 
{
    try {
        let files = await fs_promises.readdir(url_file_delivery);
        let file_new = files[(files.length)-1]
        const filePath = path.join(url_file_delivery, file_new);
        console.log('Tên tệp Delivery mới nhất:',filePath);
        return filePath;
    } catch (error) {
       console.log(error)
    }
}
const run = async () => 
{
    try {
        count_file_khoi_tao = await count_file();
        let filePath = count_file_khoi_tao;
        if(filePath != file_old)
        {
            let name_file = filePath.replace(/^.*[\\\/]/,'')
            console.log('Đọc File Mới  : ' +filePath);
            if(name_file.match('DELIVERY_STATUS_CHECK_SHEET'))
            {
                await find_name_file_exits(filePath);
            }
            file_old = filePath;
        }
        console.log('hoan thanh khoi tao lan dau');
        setTimeout(function () { console.log('Bat dau khoi tao lan tiep theo');console.log('File Cũ  : ' +file_old);run();}, 1800000);
    } catch (error) {
       console.log(error)
    }
}


const find_name_file_exits = async (file) => 
{
    try {
        await read_file(file);
        return true;
    } catch(err) {
        console.log(err);
    }    
    
}
const read_file = async (file,add) => 
{
    console.log('read file '+file);
    try {
		__io.emit('sync-model-machine');
        list_file_bom = await fs_promises.readdir(url_file_bom);
        let data = await fs_promises.readFile(file, { encoding: 'utf8' }); 
        
        let members = data.split('\r\n');
        
        for(let i = 0 ; i< (members.length);i++)
        {
            let data = members[i].split(`|`);     
            //console.log(data);
            if(i > 0)   
            {   
                if(data[23])
                {
                    let data_assy   = await AssyProduction().query(`select top (1) * from assy_production where isdelete = 0 and  order_id = '${data[23]}' order by id desc`);
                    if(data_assy.length == 0)
                    {
                        let frame = await find_article_assy(data[22],false);
                        if(frame)
                        {  
                            // console.log(frame,data[23],data_cardno[data[23]]);
                            // if(data[23] == 'AHNR125937')
                            // {
                            //     if((data_cardno[data[23]] === undefined))
                            //     {
                            //         let cardNo = await read_file_cardno(data[23]);
                            //     }
                            // }
                            // else
                            // {
                            //     if(data[38])
                            //     {
                            //         console.log(data_cardno[data[38]]);
                            //     }
                            //     else
                            //     {
                            //         console.log(data_cardno[data[23]]);
                            //     }
                            // }
                            let formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            console.log(data[23],data[22],frame,parseFloat(data[24]));  
                            await AssyProduction().query(`INSERT INTO assy_production (article_id, frame_id, order_id,qty,status,time_created,time_updated) VALUES ('${data[22]}','${frame}', '${data[23]}',${parseFloat(data[24])},2,'${formattedTime}','${formattedTime}');`);  
                        }
                    }
                    else
                    {
                        //console.log(data_assy);
                        if(data_assy[0].article_id != data[22])
                        {
                            let frame = await find_article_assy(data[22],false);
                            if(frame)
                            {  
                                console.log(frame);
                                let formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
                                console.log(data[23],data[22],frame,parseFloat(data[24]));  
                                await AssyProduction().query(`update assy_production set  frame_id = '${frame} ,time_updated = '${formattedTime}' where id = ${data_assy[0].id}`);  
                            }
                        }
                    }
                }
                if(data[31])
                { 
                    if((data_read_file[data[31]] === undefined) || (data[10] != data_read_file[data[31]].article_motor) )
                    {
                        
                        let obj = {     
                            'file_name'               : file,
                            'order_rotor_id'          : data[31],
                            'article_rotor'           : data[30],
                            'rotor_order_quantity'    : parseFloat(data[32]),
                            'rotor_Symbols'           : data[30],
                            'date_rotor_jobgen'       : data[33],
                            'shaft_Symbols'           : null,
                            'order_stator_id'         : data[23],
                            'article_stator'          : data[22],
                            'stator_order_quantity'   : parseFloat(data[24]),
                            'date_stator_jobgen'      : data[25],
                            'frame_Symbols'           : null,
                            'order_coil_id'           : data[14],
                            'article_coil'            : data[15],   
                            'rotor_coil_quantity'     : parseFloat(data[16]),
                            'date_coil_jobgen'        : data[17],
                            'order_motor_id'          : data[2],
                            'article_motor'           : data[10], 
                            'decription_motor'        : data[11],
                            'motor_order_quantity'    : parseFloat(data[3]),    
                        }
                        let rotor = data[30]; 
                        if(rotor)
                        {
                            obj.rotor_Symbols = rotor;
                        }
                        let shaft = await find_article(obj.article_motor,false);
                        if(shaft)
                        {
                            obj.shaft_Symbols = shaft;
                        }
                        if(rotor && shaft && rotor != shaft)
                        {
                            data_read_file[data[31]] = obj;
                            //console.log(obj);
                            array_read_file.push(obj);
                        }
                    }
                }
            }   
        }
        console.log('hoan thanh khoi tao');
        return true;
    } catch (err) { 
        console.log(err);
    }
}

const find_article_assy = async (article_assy) => 
{
    try {
        const filtered = list_file_bom.filter(e => e.match(article_assy));
       
		if(filtered.length > 0)
		{
			filtered.sort();
			filtered.reverse();
		}

        if(filtered.length > 0)
        {
            if(data_acticle.hasOwnProperty(article_assy))
            {
                if(data_acticle[article_assy].file != filtered[0])
                {
                    let frame = null;

                    frame = await read_file_bom_motor(filtered[0]);
                   
                    let obj = {
                        'acticle' : article_assy,
                        'file'    : filtered[0],
                        'frame'    : frame
                    };
                    data_acticle[article_assy] = obj
                    return frame;
                }
                else
                {
                    return data_acticle[article_assy].frame;
                }
            }
            else
            {
                let frame = null;
                frame = await read_file_bom_motor(filtered[0]);
                let obj = {
                    'acticle' : article_assy,
                    'file'    : filtered[0],
                    'frame' : frame
                };
                data_acticle[article_assy] = obj
                return frame;
            }
        }
        return null ;
    } catch(err) {
        console.log(err);
    }   
}
const find_article = async (article_rotor,rotor) => 
{
    try {
        //console.log(article_rotor);
        const filtered = list_file_bom.filter(e => e.match(article_rotor));
       
		if(filtered.length > 0)
		{
			filtered.sort();
			filtered.reverse();
			//console.log(filtered);
		}

        if(filtered.length > 0)
        {
            if(data_acticle.hasOwnProperty(article_rotor))
            {
                if(data_acticle[article_rotor].file != filtered[0])
                {
                    let rt = null;
                    if(rotor)
                    {
                        rt = await read_file_bom_rotor(filtered[0]);
                    }
                    else
                    {
                        rt = await read_file_bom_motor(filtered[0]);
                    }
                    let obj = {
                        'acticle' : article_rotor,
                        'file'    : filtered[0],
                        'rotor_s' : rt
                    };
                    data_acticle[article_rotor] = obj
                    return rt;
                }
                else
                {
                    return data_acticle[article_rotor].rotor_s;
                }
            }
            else
            {
                let rt = null;
                if(rotor)
                {
                     rt = await read_file_bom_rotor(filtered[0]);
                }
                else
                {
                     rt = await read_file_bom_motor(filtered[0]);
                }
                let obj = {
                    'acticle' : article_rotor,
                    'file'    : filtered[0],
                    'rotor_s' : rt
                };
                data_acticle[article_rotor] = obj
                return rt;
            }
        }
        return null ;
    } catch(err) {
        console.log(err);
    }   
}
const read_file_bom_rotor = async (file_bom) => 
{
    try {
        let data = await fs_promises.readFile(url_file_bom+'/'+file_bom, { encoding: 'utf8' }); 
        let members = data.split('\r\n');
        let data_f = null;
        if(members.length < 6)
        {
            data_f = members[2].split(`|`);  
        }
        else{
            data_f = members[3].split(`|`); 
        }
        //console.log(data_f);
        return data_f[2];
    } catch(err) {
        console.log(err);
    } 
}
const read_file_bom_motor = async (file_bom) => 
{
    try {
        let data = await fs_promises.readFile(url_file_bom+'/'+file_bom, { encoding: 'utf8' });
        let members = data.split('\r\n');
        for(let i = 0 ; i< (members.length);i++)
        {
            let data = members[i].split(`|`);
            if(i > 0)   
            {   
                if(data[2] && data[3])
                {
                    let find = data_axis.find(o => o.symbols_pid === data[2]);
                    if(find)
                    {
                        return data[2];
                    }
                }
            }   
        }
    } catch(err) {
        console.log(err);
    } 
}
const infor_order = async(msg)=> 
{
    try {
       console.log(msg);
       console.log(data_read_file[msg.order_id]);
       if(data_read_file[msg.order_id])
       {
         console.log('run');
         __io.to('notification').emit('get-info-order', { status: true, data: data_read_file[msg.order_id] });
       }
       else
       {
        __io.to('notification').emit('get-info-order', { status: false, data: "Không Tồn Tại Order" });
       }
    } catch(err) {
        __io.to('notification').emit('get-info-order', { status: false, data: "Lỗi Máy Chủ" });
    }
}
const ListOrder = async (socket, msg) => {
    socket.emit('list-orders', array_read_file);
}

const read_file_cardno = async (order) => 
{
    try {
        let files = await fs_promises.readdir(url_file_cardno);
        let file_new = files[(files.length)-1]
        const filePath = path.join(url_file_cardno, file_new);
        console.log('Tên tệp Delivery mới nhất:',filePath);
        let data = await fs_promises.readFile(filePath, { encoding: 'utf8' }); 
        
        let members = data.split('\r\n');
        
        for(let i = 0 ; i< (members.length);i++)
        {
            let data = members[i].split(`|`);     
            
            if(i > 0)   
            { 
                console.log(data[8]);
                if(data[8] != '')
                {
                    if((data_cardno[data[8]] === undefined))
                    {
                        let obj = {
                            'order' : data[8],
                            'cardno' : data[4]
                        };
                        data_cardno[data[8]] = [obj];
                    }
                    else
                    {
                        let obj2 = {
                            'order' : data[8],
                            'cardno' : data[4]
                        };
                        (data_cardno[data[8]]).push(obj2);
                    }
                    console.log(data_cardno[data[8]]);
                }
               
            }
        }
        return true;
        // if(filePath != file_old)
        // {
        //     let name_file = filePath.replace(/^.*[\\\/]/,'')
        //     console.log('Đọc File Mới  : ' +filePath);
        //     if(name_file.match('DELIVERY_STATUS_CHECK_SHEET'))
        //     {
        //         await find_name_file_exits(filePath);
        //     }
        //     file_old = filePath;
        // }
        // console.log('hoan thanh khoi tao lan dau');
        // setTimeout(function () { console.log('Bat dau khoi tao lan tiep theo');console.log('File Cũ  : ' +file_old);run();}, 1800000);
    } catch (error) {
       console.log(error)
    }
}

module.exports = {run,infor_order,ListOrder};