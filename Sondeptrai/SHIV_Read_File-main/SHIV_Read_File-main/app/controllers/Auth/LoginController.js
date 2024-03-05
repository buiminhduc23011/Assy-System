'use strict'

const { consoleLog } = require('../../../config/app');
const Users = require('../../models/Users');
const bcrypt = require('bcryptjs');
const Controller = require('../Controller');
const MasterMachine = require('../../models/MasterMachine');
const { loginLogger } = require('../../providers/logger.provider')

const login = async (socket, msg = [], checkLogin = false) => {
    try {
        loginLogger.info(JSON.stringify({ status: 'login', msg }))
        if (consoleLog) console.log('login', msg)
        let username = msg.username;
        let password = msg.password;
        let mac = getMac(msg);

        if (mac === '' || mac === undefined) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại MAC`);
            return false;
        }

        if (username === '' || username === undefined) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại Username`);
            return false;
        }

        if (password === '' || password === undefined) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại Password`);
            return false;
        }

        let machine = await Controller.findMachine(mac);

        if (!machine.status) {
            Controller.emitFail(socket, 'login', `MAC ${mac} Chưa Đăng Ký!`, true);
            return false;
        }
        if (consoleLog) console.log('login-check-machine', machine.data.Name);
        let find = [];
        let user = [];
        let insert = false;
        // Tim kiem user trong listClients
        find = await Controller.findClient(mac);

        if (!find.status) {
            // Tim kiem user theo username trong DB
            user = await Users().first({
                where: [`username = '${username}'`, 'IsDelete = 0'],
                select: ['id', 'username', 'password', 'level', 'name']
            });

            insert = true;
        } else {
            if (find.data.username.toUpperCase() != username.toUpperCase()) {
                // Tim kiem user theo username trong DB
                user = await Users().first({
                    where: [`username = '${username}'`, 'IsDelete = 0'],
                    select: ['id', 'username', 'password', 'level', 'name']
                });
            } else {
                user = find.data;
            }
        }

        // khong tim thay user
        if (!user) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại Tài Khoản ${username}`);
            return false;
        }

        // Kiem tra password login vaf password trong DB
        let match = await bcrypt.compareSync(password, user.password);

        if (!match) {
            Controller.emitFail(socket, 'login', `Mật Khẩu Không Chính Xác`)
            return false;
        }
        if (!checkLogin) {
            socket.emit('login', {
                status: true,
                message: convStrToUnsigned("Đăng Nhập Thành Công"),
                time: moment().format('YYYY-MM-DD HH:mm:ss')
            });
        }

        if (insert) {
            // Tim kiem lai trong TH IOT vua login vua connect dong thoi
            let findAgain = await Controller.findClient(mac);

            if (findAgain.status) {
                if (listClients[findAgain.pos].connect != 1 || listClients[findAgain.pos].login != 1)
                    __io.to('notification').emit('list-clients', listClients);
                listClients[findAgain.pos].idSocket = socket.id;
                listClients[findAgain.pos].username = user.username;
                listClients[findAgain.pos].userId = user.id ?? (user.userId ?? 0);
                listClients[findAgain.pos].levelUser = user.level ?? (user.levelUser ?? 0);
                listClients[findAgain.pos].password = user.password;
                listClients[findAgain.pos].passwordDcode = password;
                listClients[findAgain.pos].name = user.name;
                listClients[findAgain.pos].connect = 1;
                listClients[findAgain.pos].login = 1;
                listClients[findAgain.pos].machineName = machine.data.Symbols ?? '';
                listClients[findAgain.pos].typeMachine = machine.data.Type ?? 1;
            } else {
                let client = {
                    idSocket: socket.id,
                    idSub: 0, // ID machine
                    userId: user.id ?? (user.userId ?? 0),
                    username: username,
                    name: user.name,
                    levelUser: Number(user.level ?? 0),
                    mac: mac,
                    password: user.password,
                    passwordDcode: password,
                    offset: 0,
                    plans: [],
                    planStart: [], // Plan start cua may do, dung de tu dong quay ve plan cu sau n giay
                    product: 0, // Product Plan chay truoc do
                    connect: 1,
                    time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    statusMachine: 1,
                    startPlan: false,
                    versionFirmware: msg.firmware ?? "IOTV1.0",
                    hmi: msg.hmi ?? (msg.HMI ?? 'HMI_V1.0'),
                    ip: msg.IP ?? (msg.ip ?? ''),
                    htb: 0,
                    hsd: 0,
                    hkd: 0,
                    hld: 0,
                    q: 0,
                    login: 1,
                    machineName: machine.data.Symbols ?? '',
                    typeMachine: machine.data.Type ?? 1,
                    action: [], // Hanh dong cua nguoi dung
                }

                let findClientLogout = await Controller.findClientLogout(getMac(msg));

                if (findClientLogout.status) {
                    client.versionFirmware = findClientLogout.data.versionFirmware ?? (msg.firmware ?? "IOTV1.0");
                    client.hmi = findClientLogout.data.hmi ?? (msg.hmi ?? (msg.HMI ?? 'HMI_V1.0'));
                    client.ip = findClientLogout.data.ip ?? (msg.IP ?? (msg.ip ?? ''));
                    listLogouts.splice(findClientLogout.pos, 1);
                }

                // if(consoleLog) console.log("Chạy day ha",client);
                listClients.push(client);
                __io.to('notification').emit('list-clients', listClients);
            }
        } else {
            // if(find.data.idSocket == socket.id) return true;
            // if(consoleLog) console.log("Chạy day r");
            let sendClient = false;
            if (listClients[find.pos].connect != 1 || listClients[find.pos].login != 1) sendClient = true;

            listClients[find.pos].idSocket = socket.id;
            listClients[find.pos].username = user.username;
            listClients[find.pos].userId = user.id ?? (user.userId ?? 0);
            listClients[find.pos].levelUser = user.level ?? (user.levelUser ?? 0);
            listClients[find.pos].password = user.password;
            listClients[find.pos].passwordDcode = password;
            listClients[find.pos].name = user.name;
            listClients[find.pos].connect = 1;
            listClients[find.pos].login = 1;
            listClients[find.pos].machineName = machine.data.Symbols ?? '';
            listClients[find.pos].typeMachine = machine.data.Type ?? 1;

            if (sendClient) __io.to('notification').emit('list-clients', listClients);
        }
        let uId = user.id ?? (user.userId ?? 0);
        // Cap Nhat Trang Thai Login Machine
        if (Number(machine.data.User_Login_ID) != Number(uId) && Number(uId) != 0) {
            listMachine[machine.pos].User_Login_ID = Number(uId);
            await MasterMachine().update({
                where: [`ID = ${machine.data.ID}`],
                value: [`User_Login_ID = ${uId}`]
            });
        }

        // Thoat khoi room notification
        socket.leave('notification');
        socket.join('room-iot');
        __io.to('notification').emit('notification', { server: '', client: `User ${username} connect` });

        // Send to server OEE after user login
        __io.to('notification').emit('user-login', {
            userId: user.id ?? (user.userId ?? 0),
            machineId: machine.data.ID ?? 0,
            isLogined: true
        });

        return true;
    } catch (e) {
        logger.error("Error login");
        logger.error(e);
    }
}

const logout = async (socket, msg = []) => {
    try {
        loginLogger.info(JSON.stringify({ status: 'logout', msg }))
        let username = msg.username;
        let password = msg.password;
        let mac = getMac(msg);

        if (mac === '' || mac === undefined) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại MAC`);
            return false;
        }

        if (username === '' || username === undefined) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại Username`);
            return false;
        }

        if (password === '' || password === undefined) {
            Controller.emitFail(socket, 'login', `Không Tồn Tại Password`);
            return false;
        }

        let find = await Controller.findClient(mac);
        let status = true;
        let message = "Đăng Xuất Thành Công!";

        if (find.status) {
            if (find.data.username.toUpperCase() == username.toUpperCase() && find.data.passwordDcode == password) {
                listClients[find.pos].login = 0;
                listClients[find.pos].name = '';
                listClients[find.pos].username = '';
                listClients[find.pos].userId = 0;
                listClients[find.pos].planStart = [];
                listClients[find.pos].password = '';
                listClients[find.pos].passwordDcode = '';
                let machine = await Controller.findMachine(find.data.mac);

                if (machine.status) {
                    listMachine[machine.pos].Is_Running = false;
                    listMachine[machine.pos].User_Login_ID = null;
                    listClients[find.pos].machineName = machine.data.Symbols ?? '';
                    listClients[find.pos].typeMachine = machine.data.Type ?? 1;
                    await MasterMachine().update({
                        where: [`ID = ${machine.data.ID}`],
                        value: [`Is_Running = 'false'`, `User_Login_ID = null`]
                    });
                }

                // Send to server OEE after user logout
                __io.to('notification').emit('user-login', {
                    userId: find.data.userId,
                    machineId: machine.data.ID ?? 0,
                    isLogined: false
                });
                // listLogouts.push(find.data);
                // listClients.splice(find.pos, 1);
                // Send to plan reset
                socket.emit('plan', await Controller.emitPlan([], []));
            } else { status = false; message = "Tên Tài Khoản Hoặc Mật Khẩu Không Chính Xác!" }
        }

        __io.to('notification').emit('notification', { server: `User ${username} ${message}`, client: msg });
        __io.to('notification').emit('list-clients', listClients);

        socket.emit('logout', {
            status: status,
            message: convStrToUnsigned(message)
        });

        return true;
    } catch (e) {
        logger.error("Error logout");
        logger.error(e);
    }
}

const getListPermission = async () => {
    try {
        listPermission = await Users().query(`select ur.user_id, r.role from user_role as ur join role as r on r.id = ur.role_id`);
        if (consoleLog) console.log(listPermission);

        return true;
    } catch (e) {
        if (consoleLog) console.log("Error Get List Permission", e);
        logger.error("Error get list permission", e);
    }
}

const getListGroupPermission = async () => {
    try {
        listGroupPermission = await Users().query(`select ugr.user_id, r.role from user_group_role as ugr
            inner join group_role_role as grr on grr.group_role_id = ugr.group_role_id
            inner join role as r on r.id = grr.role_id
            inner join users as u on u.id = ugr.user_id
            where u.IsDelete = 0 and r.isdelete = 0`
        );
        if (consoleLog) console.log(listGroupPermission);

        return true;
    } catch (e) {
        if (consoleLog) console.log("Error Get List Group Permission", e);
        logger.error("Error get list group permission", e);
    }
}

const editPermission = async (req, res) => {
    getListPermission();
    res.send("Edit Permision");
    return true;
}

const editGroupPermission = async (req, res) => {
    getListGroupPermission();
    console.log("Edit Group Permision");
    res.send("Edit Group Permision");
    return true;
}

const updateLevelUser = async () => {
    try {
        let users = await Users().get({
            select: ['id', 'level', 'username'],
        });
        for (let i = 0; i < listClients.length; i++) {
            for (let j = 0; j < users.length; j++) {
                if (listClients[i].userId == users[j].id && !users[j].IsDelete) {
                    listClients[i].levelUser = users[j].level;
                    listClients[i].username = users[j].username;
                    break;
                }
            }
        }

        return true;
    } catch (e) { logger.error("Error Update User", e); return false; }
}

const editLevelUser = async (req, res) => {
    updateLevelUser();
    res.send("Edit Level User");
    return true;
}

module.exports = {
    login,
    logout,
    getListPermission,
    editPermission,
    editLevelUser,
    getListGroupPermission,
    editGroupPermission
}