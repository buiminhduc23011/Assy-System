'use strict'

const config = require('../../config/router');
const { consoleLog } = require('../../config/app');
const fs = require('fs');
const multer = require("multer");
const path = require('path');
const { networkInterfaces } = require('os');
const moment = require('moment');
const Controller = require('./Controller');
const MasterMachine = require('../models/MasterMachine');
const RotorProduction = require('../models/RotorProduction');
const RotorProductionDetail = require('../models/RotorProductionDetail');
const CommandTranfer = require('../models/CommandTranfer');
const MasterAxis = require('../models/MasterAxis');
const ProcessMachine = require('../models/ProcessMachine');
var transit_status = -1;
const AssyProduction = require('../models/AssyProduction');
const AssyProductionDetail = require('../models/AssyProductionDetail');
const get_list_machine = async(req, res) => {
    try {
        const formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(formattedTime);
        data_machine   = await MasterMachine().query(`select * from master_machine where isdelete = 0`);
        //console.log(data_machine);

    } catch(err) {
        console.log(err);
    }   
}
const get_list_axis = async(req, res) => {
    try {
        data_axis   = await MasterAxis().query(`select * from master_axis where isdelete = 0`);
        //console.log(data_axis);
    } catch(err) {
        console.log(err);
    }   
}
const connectIOT = async (socket, msg) => {
    try {

        let login = 0;
        let usernameLogin = '';
        let passwordLogin = '';
        let machi = await find_mac(msg.mac);
        console.log(machi);
        if(machi)
        {
            let client = {
                idSocket: socket.id,
                mac: msg.mac, 
                machineName : machi.machine_name,
                machineSymbols : machi.machine_symbols,
                machineId : machi.id,
                connect: 1,
                free: false,
                connected_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            let find = await Controller.findClient(msg.mac);
            console.log(find)
            if(find.status)
            {
                listClients[find.pos].connect = 1;
                listClients[find.pos].idSocket = socket.id;
            }
            else
            {
                listClients.push(client);
                find = {
                    status: true,
                    data: client
                };
            }
            // await MasterMachine().query(`update master_machine set isconnected = 1 where id = ${machi.id}`);
            __io.to('notification').emit('control-btn', { server: find.data, client: msg.mac });
            __io.to('notification').emit('list-clients', listClients);
            __io.to('notification').emit('machine-connect', 
            {
                machineId: client.machineId,         
                isConnected: 1,
            });
            connectLog.error('Connect ', JSON.stringify({ status: true, data: find.data }));
            return { status: true, data: find.data };
        }
        
        return { status: false, data: "Máy Không Tồn Tại" };
    } 
    catch (e) 
    {
        if (consoleLog) console.log("Connect IOT Error", e);
        logger.error("Connect IOT Error", e);
        return { status: false, data: e };
    }
}  
const find_mac = async (mac) => {
    //console.log(mac);
    let obj = data_machine.find(o => o.mac === mac);
    return obj;
}
const find_id = async (id) => {
    let obj = data_machine.find(o => o.id === id);
    return obj;
}
const pushDataRotor = async (socket,msg) => {
    try {
        for(let i = 0 ; i< (msg.length);i++)
        {
            let formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(formattedTime);
            msg[i].status = 2;
            msg[i].qty_production = 0;
            msg[i].isdelete = 0;
            await RotorProduction().insert([msg[i]]);    
        }
        socket.emit('push-data-rotor', {status:true});
    } catch (error) {
        socket.emit('push-data-rotor', {status:false});  
    }
}
const pushDataTranfer = async (socket,msg) => {
    try {
        for(let i = 0 ; i< (msg.length);i++)
        {
            msg[i].isdelete = 0;
            await CommandTranfer().insert([msg[i]]);
            let find = await Controller.findClientWithid(msg[i].transit_car_id);
            console.log(find);
            // kiểm tra xe có rảnh hay k ?
            if(find.status)
            {
                console.log(listClients[find.pos].free)
                if(listClients[find.pos].connect && listClients[find.pos].free)
                {
                    let obj_return = {
                        'machine_id'  : msg[i].machine_id,
                        'conveyor_id' : msg[i].conveyor_id,
                        'type'        : msg[i].type,
                    } 
                    __io.emit('command-tranfer',obj_return);
                }
                else
                {
                    connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Chưa Kết Nối" }));
                }
            }
            else
            {
                connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
            }
        }
        socket.emit('push-data-tranfer', {status:true});
    } catch (error) {
        console.log(error);
        socket.emit('push-data-tranfer', {status:false});  
    }
}
const find_symbols_truc = async (symbols) => {
    //console.log(mac);
    let obj = data_axis.find(o => o.symbols_pid === symbols);
    return obj;
}
const getDataRotorWithMachine = async (socket,msg) => {
    console.log('real');
    console.log(msg);
    connectLog.debug('Send-server', JSON.stringify({ status: true, msg: msg }));
    let machi = await find_mac(msg.mac);
    let tray_id = msg.tray_id;
    if(machi)
    {
        let find = await Controller.findClient(machi.mac);
        if(find.status)
        {
            let data_tray   = await RotorProduction().query(`select top (1) * from rotor_production where isdelete = 0 and status = 2 and tray_id = '${tray_id}' order by id desc`);
            let obj ={};
            if(data_tray.length > 0)
            {
                obj.status = true;
                obj.type_rotor   = 0;
                let find_truc = await find_symbols_truc(data_tray[0].truc_id)
                if(find_truc)
                {
                    obj.type_rotor   = find_truc.type_rotor; 
                }
                else
                {
                    connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Mã Trục" }));
                }
                obj.data = data_tray[0];
                console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' : ' + obj.status);
                socket.emit('get-data-rotor-machine-with-machine', obj);
                connectLog.debug('server-return', JSON.stringify({ status: true, msg: obj }));
            }
            else
            {
                obj.status = false;
                obj.data = {};
                obj.type_rotor   = 0;
                console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' : '+obj.status);
                socket.emit('get-data-rotor-machine-with-machine', obj);
                connectLog.debug('server-return', JSON.stringify({ status: false, msg: obj }));
            }
        }
        else
        {
            connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Sản Xuất" }));
        }
    }
    else
    {
        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Sản Xuất Chưa Được Khai Báo" }));
    }
    
}
const getDataRotorWithMachineWaiting = async (socket,msg) => 
{
    console.log('watting');
    console.log(msg);
    connectLog.debug('Send-server', JSON.stringify({ status: true, msg: msg }));
    let machi = await find_mac(msg.mac);
    let tray_id = msg.tray_id;
    if(machi)
    {
        let find = await Controller.findClient(machi.mac);
        console.log('watting '+find);
        if(find.status)
        {

                let data_tray   = await RotorProduction().query(`select top (1) * from rotor_production where isdelete = 0 and status = 2 and tray_id = '${tray_id}' order by id desc`);
                let obj ={};
                if(data_tray.length > 0)
                {
                    obj.status = true;
                    obj.type_rotor   = 0;
                    let find_truc = await find_symbols_truc(data_tray[0].truc_id)
                    if(find_truc)
                    {
                        obj.type_rotor   = find_truc.type_rotor; 
                    }
                    obj.data = data_tray[0];
                    console.log(obj);
                    socket.emit('get-data-rotor-machine-with-machine-waiting', obj);
                }
                else
                {
                    obj.status = false;
                    obj.data = {};
                    obj.type_rotor   = 0;
                    console.log(obj);
                    socket.emit('get-data-rotor-machine-with-machine-waiting', obj);
                }   
        }
        else
        {
            connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Sản Xuất" }));
        }
    }
    else
    {
        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Sản Xuất Chưa Được Khai Báo" }));
    }
}
const pushDataProduction = async (msg) =>{
    console.log(msg);
    let machi = await find_mac(msg.mac);
    let tray_id = msg.tray_id;
    let qty = msg.qty;
    let height_setting = msg.height_setting;
    let shaft_diameter_setting = msg.shaft_diameter_setting;
    let temperature_setting = msg.temperature_setting;
    let formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if(machi)
    {
        let find_data   = await RotorProduction().query(`select top (1) * from rotor_production where isdelete = 0 and status = 2 and tray_id = '${tray_id}'order by id desc`);
        if(find_data.length > 0)
        {
            for(let i = 1;i<=5;i++)
            {
                let rt = (msg['Roto_'+i]).split('^');
                if(rt[0] && rt[1] && rt[1] != 0)
                {
                    let obj ={
                        'rotor_production_id' : find_data[0].id,
                        'height':rt[0],
                        'status':rt[1]
                    };
                    await RotorProductionDetail().insert([obj]);
                }
            }
            await RotorProduction().query(`update rotor_production set machine_id = '${machi.id}' , qty_production = '${qty}' , status = 1 ,height_setting = '${height_setting}',shaft_diameter_setting = '${shaft_diameter_setting}',temperature_setting = '${temperature_setting}',time_updated = '${formattedTime}' where isdelete = 0 and status = 2 and tray_id = '${tray_id}'`);
            __io.to('notification').emit('update-report',{});
            await RotorProduction().query(`update schedule set status = 1  where order_id = '${find_data.order_id}'`);
        }
    }
}
const MachineStatus = async (socket,msg) =>
{
    let machi = await find_mac(msg.mac);
    let machine_status = msg.status;
    if(machine_status != transit_status)
    {
        console.log('status xe gong');
        console.log(msg);
        transit_status = machine_status;
    }
    if(machi)
    {
        if(machine_status == 1)
        {
            let find = await Controller.findClientWithid(machi.id);
            if(find.status)
            {
                find.data.free = true;
                let data_cm   = await CommandTranfer().query(`select top (1) * from command_tranfer where transit_car_id = '${machi.id}' and isdelete = 0 and status < 4 `);
                if(data_cm.length > 0)
                {
                    let obj = {
                        'machine_id'  : data_cm[0].machine_id,
                        'conveyor_id' : data_cm[0].conveyor_id,
                        'type'        : data_cm[0].type,
                    } 
                   __io.to(listClients[find.pos].idSocket).emit('command-tranfer',obj);
                } 
                else
                {
                    connectLog.debug('server-return-fill-cm', JSON.stringify({ status: true, msg: "Không Tìm Thấy Lệnh Tray" })); 
                }
            }
            else
            {
                connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
            }
        }
        else
        {
            let find = await Controller.findClientWithid(machi.id);
            if(find.status)
            {
                find.data.free = false; 
                if(machine_status < 5 && machine_status != 0)
                {
                    let data_run   = await CommandTranfer().query(`select top (1) * from command_tranfer where transit_car_id = '${machi.id}' and isdelete = 0 and status < 4`);
                    if(data_run.length > 0)
                    {
                        let data_run_2   = await CommandTranfer().query(`select top (1) * from command_tranfer where transit_car_id = '${machi.id}' and isdelete = 0 and status =`+(machine_status)+``);
                        if(data_run_2.length == 0)
                        {
                            await CommandTranfer().query(`update command_tranfer set status = `+machine_status+` where id = '${data_run[0].id}'`); 
                            connectLog.debug('server-return-fill-cm', JSON.stringify({ status: true, msg: "Update trạng thái lệnh" }));
                        }
                    }
                }
            }
            else
            {
                connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
            }
        }
    }
}
const TranferTray = async (socket,msg,type) => 
{
    if(type == 1)
    {
        console.log('input tray');
        console.log(msg);
    }
    else
    {
        console.log('out tray');
        console.log(msg);
    }

    let machi = await find_mac(msg.mac);
    let status = msg.status;
    if(machi)
    {
        if(status == 'true')
        {
            //yêu cầu cấp tray
            if(machi.conveyor_input_id && machi.tranfer_car_id)
            {
                let data_cm   = await CommandTranfer().query(`select top (1) * from command_tranfer where machine_id = '${machi.id}' and isdelete = 0 and status < 4 and type = `+type+``); 
                if(data_cm.length > 0)
                {
                    connectLog.debug('server-return-fill-cm', JSON.stringify({ status: true, msg: data_cm[0] }));
                    let find = await Controller.findClientWithid(machi.tranfer_car_id);
                    let data_status_1  = await CommandTranfer().query(`select top (1) * from command_tranfer where machine_id = '${machi.id}' and isdelete = 0 and status = 1 and id < `+data_cm[0].id);
                    if(find.status && data_status_1.length == 0 )
                    {
                        if(listClients[find.pos].connect && listClients[find.pos].free)
                        {
                            let obj = {
                                'machine_id'  : data_cm[0].machine_id,
                                'conveyor_id' : data_cm[0].conveyor_id,
                                'type'        : data_cm[0].type,
                            } 
                            __io.to(listClients[find.pos].idSocket).emit('command-tranfer',obj);
                        }
                        else
                        {
                            connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Chưa Kết Nối" }));
                        }
                    }
                    else
                    {
                        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
                    }
                }
                else
                {
                    let obj = {
                        'machine_id' : machi.id,
                        'transit_car_id' : machi.tranfer_car_id,
                        'conveyor_id' : machi.conveyor_input_id,
                        'status' : 1,
                        'type':type,
                        'user_created' : 1,
                        'user_updated' : 1,
                    }
                    await CommandTranfer().insert([obj]);
                    connectLog.debug('server-return-create-cm', JSON.stringify({ status: true, msg: obj }));
                    let find = await Controller.findClientWithid(machi.tranfer_car_id);
                    //let data_status_1  = await CommandTranfer().query(`select top (1) * from command_tranfer where machine_id = '${machi.id}' and isdelete = 0 and status = 1 and id < `+data_cm[0].id);
                    if(find.status  && data_status_1.length == 0)
                    {
                        if(listClients[find.pos].connect && listClients[find.pos].free)
                        {
                            let obj_return = {
                                'machine_id'  : obj.machine_id,
                                'conveyor_id' : obj.conveyor_id,
                                'type'        : obj.type,
                            } 
                            __io.to(listClients[find.pos].idSocket).emit('command-tranfer',obj_return);
                        }
                        else
                        {
                            connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Chưa Kết Nối" }));
                        }
                    }
                    else
                    {
                        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
                    }
                }
            }
            else
            {
                connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Sản Xuất Chưa Được Khai Báo Băng Tải Và Xe Vận Chuyển" }));
            }
        }
        else
        {
            //kiểm tra xe có đang chạy hay không 
            let data_run   = await CommandTranfer().query(`select top (1) * from command_tranfer where machine_id = '${machi.id}' and isdelete = 0 and status < 4 and type = `+type);
            if(data_run.length > 0)
            {
                if(data_run[0].status == 2)
                {
                    let find = await Controller.findClientWithid(machi.tranfer_car_id);
                        console.log(find);
                        if(find.status)
                        {
                            console.log(listClients[find.pos].free)
                            if(listClients[find.pos].connect)
                            {
                                let obj_return = {
                                    'machine_id'  : '',
                                    'conveyor_id' : '',
                                    'type'        : 3,
                                }
                                console.log(obj_return); 
                                __io.to(listClients[find.pos].idSocket).emit('command-tranfer',obj_return);
                            }
                            else
                            {
                                connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Chưa Kết Nối" }));
                            }
                        }
                        else
                        {
                            connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
                        }
                }
                else if(data_run[0].status == 3)
                {
                    await CommandTranfer().query(`update command_tranfer set status = 4 where id = '${data_run[0].id}'`);
                }
            }
            await CommandTranfer().query(`update command_tranfer set isdelete = 1 where machine_id = '${machi.id}' and isdelete = 0 and status < 4 and type = `+type);
        }
    }
    else
    {
        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Sản Xuất Chưa Được Khai Báo" }));
    }
}
const cancelCM = async (socket,msg) => {
    console.log('cancel tray');
    console.log(msg);
    let machi = await find_mac(msg.mac);
    let status = msg.status;
    if(machi)
    {
        let find = await Controller.findClientWithid(machi.tranfer_car_id);
        console.log(find);
                    // kiểm tra xe có rảnh hay k ?
        if(find.status)
        {
            if(listClients[find.pos].connect)
            {
                let obj_return = {
                                'machine_id'  : '',
                                'conveyor_id' : '',
                                'type'        : 3,
                } 
                __io.emit('command-tranfer',obj_return);
            }
            else
            {
                connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Chưa Kết Nối" }));
            }
        }
        else
        {
            connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Không Tìm Thấy Máy Vận Chuyển Tray" }));
        }
    }
    else
    {
        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Sản Xuất Chưa Được Khai Báo" }));
    }
}
const SyncModelMachine = async (socket,msg) => {
    console.log(msg.mac);
    // console.log(msg.data);
    let machi = await find_mac(msg.mac);
    
    if(machi)
    {
        let dat = msg.data;
        for(let i = 0;i < dat.length;i++)
        {
            
            let val = dat[i];
            let axis = val.Truc;
            let rotor = val.Roto;
            let model = val.Model;
            let position = val.Pos_LapTruc;
            let type =  val.LoaiTruc;
            console.log(axis,rotor,position,type);

            let data_process   = await ProcessMachine().query(`select top (1) * from process_machine where machine_id = '${machi.id}' and model = '${model}' and rotor = '${rotor}' and axis = '${axis}' `); 
            if(data_process.length <= 0)
            {
                await ProcessMachine().query(`INSERT INTO process_machine (machine_id, model,rotor,axis,isdelete) VALUES ('`+machi.id+`', '`+model+`','`+rotor+`','`+axis +`','0')`);
            }
            let pos = 'VT_1'
            if(position == 2)
            {
                pos = 'VT_2'
            }
            if(position == 3)
            {
                pos = 'VT_3'
            }
            await RotorProduction().query(`update master_axis set type_rotor = '${type}' , image='${pos}'  where isdelete = 0 and symbols_pid = '${axis}'`);
        }
       
    }
}

const AssyGetDataOrder = async (socket,msg) => {
    console.log('get-data-assy');
    console.log(msg);
    connectLog.debug('Send-server', JSON.stringify({ status: true, msg: msg }));
    let machi = await find_mac(msg.mac);
    let order = msg.order;
    if(machi)
    {
        let data_order   = await AssyProduction().query(`select top (1) * from assy_production where isdelete = 0 and status = 2 and order_id = '${order}' order by id desc`);
        let obj ={};
        if(data_order.length > 0)
        {
            obj.order_id   = order;
            obj.status   = true;
            obj.frame_id   = data_order[0].frame_id;
            obj.qty        = data_order[0].qty;
            console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' : ' + obj);
            socket.emit('assy-get-data-order', obj);
            connectLog.debug('server-return', JSON.stringify({ status: true, msg: obj }));
        }
        else
        {
            obj.order_id   = order;
            obj.status = false;
            obj.frame_id = null;
            obj.qty   = 0;
            console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' : '+obj);
            socket.emit('assy-get-data-order', obj);
            connectLog.debug('server-return', JSON.stringify({ status: true, msg: obj }));
        }
    }
    else
    {
        connectLog.debug('server-return-error', JSON.stringify({ status: true, msg: "Máy Sản Xuất Chưa Được Khai Báo" }));
    }
    
}
const AssyPushDataProduction = async (socket,msg) =>{
    console.log(msg);
    let machi = await find_mac(msg.mac);
    let order = msg.Data[0].OrderID;
    let detail = msg.Data[0];
    let formattedTime = moment().format('YYYY-MM-DD HH:mm:ss');
    
    if(machi)
    {
        let data_order   = await AssyProduction().query(`select top (1) * from assy_production where isdelete = 0 and status = 2 and order_id = '${order}' order by id desc`);
        if(data_order.length > 0)
        {
            if(detail.FrameData_1.ID != '')
            {
                let obj ={
                    
                    'assy_production_id' : data_order[0].id,
                    'card_no' :  data_order[0].order_id+'-'+data_order[0].frame_id+'-'+(1),
                    'product_id' :''+detail.FrameData_1.ID,
                    'height':''+detail.FrameData_1.Ass_Height,
                    'depth':''+detail.FrameData_1.Drill_Depth,
                    'flatness':''+detail.FrameData_1.Pin_Error,
                    'status':''+detail.FrameData_1.Status,
                };
                await AssyProductionDetail().insert([obj]);
            }
            if(detail.FrameData_2.ID != '')
            {
                let obj ={
                    
                    'assy_production_id' : data_order[0].id,
                    'card_no' :  data_order[0].order_id+'-'+data_order[0].frame_id+'-'+(2),
                    'product_id' :''+detail.FrameData_2.ID,
                    'height':''+detail.FrameData_2.Ass_Height,
                    'depth':''+detail.FrameData_2.Drill_Depth,
                    'flatness':''+detail.FrameData_2.Pin_Error,
                    'status':''+detail.FrameData_2.Status,
                };
                await AssyProductionDetail().insert([obj]);
            }
            if(detail.FrameData_3.ID != '')
            {
                let obj ={
                    
                    'assy_production_id' : data_order[0].id,
                    'card_no' :  data_order[0].order_id+'-'+data_order[0].frame_id+'-'+(3),
                    'product_id' :''+detail.FrameData_3.ID,
                    'height':''+detail.FrameData_3.Ass_Height,
                    'depth':''+detail.FrameData_3.Drill_Depth,
                    'flatness':''+detail.FrameData_3.Pin_Error,
                    'status':''+detail.FrameData_3.Status,
                };
                await AssyProductionDetail().insert([obj]);
            }
            if(detail.FrameData_4.ID != '')
            {
                let obj ={
                    
                    'assy_production_id' : data_order[0].id,
                    'card_no' :  data_order[0].order_id+'-'+data_order[0].frame_id+'-'+(4),
                    'product_id' :''+detail.FrameData_4.ID,
                    'height':''+detail.FrameData_4.Ass_Height,
                    'depth':''+detail.FrameData_4.Drill_Depth,
                    'flatness':''+detail.FrameData_4.Pin_Error,
                    'status':''+detail.FrameData_4.Status,
                };
                await AssyProductionDetail().insert([obj]);
            }
            if(detail.FrameData_5.ID != '')
            {
                let obj ={
                    
                    'assy_production_id' : data_order[0].id,
                    'card_no' :  data_order[0].order_id+'-'+data_order[0].frame_id+'-'+(5),
                    'product_id' :''+detail.FrameData_5.ID,
                    'height':''+detail.FrameData_5.Ass_Height,
                    'depth':''+detail.FrameData_5.Drill_Depth,
                    'flatness':''+detail.FrameData_5.Pin_Error,
                    'status':''+detail.FrameData_5.Status,
                };
                await AssyProductionDetail().insert([obj]);
            }
            __io.to('notification').emit('update-report',{});
            await RotorProduction().query(`update assy_production set status = 1 , machine_id = ${machi.id} where id = '${data_order[0].id}'`);
            socket.emit('assy-push-data-production', {'status':true,OrderID:order});
        }
    }
    socket.emit('assy-push-data-production', {'status':false});
}
module.exports = {
    connectIOT,get_list_machine,pushDataRotor,getDataRotorWithMachine,pushDataProduction,getDataRotorWithMachineWaiting,get_list_axis,pushDataTranfer,MachineStatus,cancelCM,TranferTray,SyncModelMachine,AssyGetDataOrder,AssyPushDataProduction
};