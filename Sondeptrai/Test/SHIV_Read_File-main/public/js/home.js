'use strict'

// const { Socket } = require("socket.io-client");

$(document).ready(function() {
    console.log("home.js");

    function writeMessage(id = '', msg = []) {
        let str = $(`#${id}`).val() + '\n';
        if($(`#${id}`).val() == '') str = $(`#${id}`).val();
        $(`#${id}`).val(str + JSON.stringify(msg));
    }

    socket.on('login', (msg) => {
        console.log('Event login', msg);
        $('.alert-login').text(msg.message);
        writeMessage('message-login', msg);
    });

    socket.on('logout', (msg) => {
        console.log('Event logout', msg);
        $('.alert-login').text(msg.message);
        writeMessage('message-login', msg);
    });

    $('.btn-login').on('click', () => {
        let login =  {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val()
        }
        console.log(login)
        socket.emit('login', login);
        writeMessage('message-login', login);
        $('.btn-get-plan').click();
    });

    $('.btn-logout').on('click', () => {
        let logout =  {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val()
        }
        console.log(logout)
        socket.emit('logout', logout);
        writeMessage('message-login', logout);
    });

    socket.on('update-firmware', (msg) => {
        console.log(msg);
    });

    let planId = 0;
    let userId = 0;
    let machineId = 0;
    socket.on('plan', (msg) => {
        console.log(msg);
        if(!msg.status) {
            $('.alert-plan').text(msg.message)
        } else {
            planId      = msg.planId;
            userId      = msg.userId;
            machineId   = msg.machineId;
            // htb
            // hsd
            $('.planId').val(planId);
            $('.status-plan-id').val(msg.statusPlan);
            $('.product').val(msg.product);
            $('.stage').val(msg.process);
            $('.plan-id').val(msg.planNumber);
            $('.lot-no').val(msg.lotno);
            $('.quality-plan').val(msg.qtyPlan);
            $('.actual-plan').val(msg.qty);
            $('.a-plan').val(msg.hkd);
            $('.ld-plan').val(msg.hld);
            $('.qc-plan').val(msg.q);
            $('.time-setup-plan').val(msg.timeSetup);
            $('.time-check-plan').val(msg.timeCheck);
        }
        writeMessage('message-plan', msg);
    });

    socket.on('check-login', (msg) => {
        console.log(msg);
        $('.alert-plan-2').text(msg.message);
        writeMessage('message-plan-2', msg);
    });

    socket.on('time-setup-check', (msg) => {
        console.log(msg);
        $('.alert-plan-2').text(msg.message);
        writeMessage('message-plan-2', msg);
    });

    $('.btn-get-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: 0,
            statusPlan: 0,
            nextPlan: 0,
        }
        socket.emit('plan', data);
        writeMessage('message-plan', data);
    });

    // Next Plan
    $('.btn-next-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            statusPlan: 0,
            nextPlan: 1,
        }

        socket.emit('plan', data);
        writeMessage('message-plan', data);
    });

    // Back Plan
    $('.btn-back-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            statusPlan: 0,
            nextPlan: 2,
        }

        socket.emit('plan', data);
        writeMessage('message-plan', data);
    });

    // Start plan
    $('.btn-start-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            statusPlan: 1,
            nextPlan: 0,
        }

        socket.emit('plan', data);
        writeMessage('message-plan', data);
    });

    $('.btn-update-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId
        }

        socket.emit('update-plan', data);
        writeMessage('message-plan', data);
    });

    // Stop plan
    $('.btn-stop-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            statusPlan: 2,
            nextPlan: 0,
        }

        socket.emit('plan', data);
        writeMessage('message-plan', data);
    });

    // End plan
    $('.btn-end-plan').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            statusPlan: 3,
            nextPlan: 0,
        }

        socket.emit('plan', data);
        writeMessage('message-plan', data);
    });

    // Start Setup 
    $('.btn-start-setup').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            usernameTask: $('.usernameTask').val(),
            passwordTask: $('.passwordTask').val(),
            type: 1,
        }

        socket.emit('check-login', data);
        writeMessage('message-plan-2', data);
    });

    // Start Check Cross 
    $('.btn-start-check-cross').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            usernameTask: $('.usernameTask').val(),
            passwordTask: $('.passwordTask').val(),
            type: 2,
        }

        socket.emit('check-login', data);
        writeMessage('message-plan-2', data);
    });

    // End Setup 
    $('.btn-end-setup').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            usernameTask: $('.usernameTask').val(),
            passwordTask: $('.passwordTask').val(),
            type: 1,
            timeTask: $('.time-setup-actual').val(),
        }

        socket.emit('time-setup-check', data);
        writeMessage('message-plan-2', data);
    });

    // End Check Cross 
    $('.btn-end-check-cross').on('click', function() {
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC: $('.mac').val(),
            planId: planId,
            usernameTask: $('.usernameTask').val(),
            passwordTask: $('.passwordTask').val(),
            type: 2,
            timeTask: $('.time-check-actual').val(),
        }

        socket.emit('time-setup-check', data);
        writeMessage('message-plan-2', data);
    });

    let machineStatus = 0,
        type          = 0,
        status        = 0,
        quatityStatus = 0,
        typeQuatity   = 0,
        statusQuatity = 0;
    let runErrStop = {
        '000': {
            value: 0,
            status: 0,
            des: 'May Dung'
        },
        '100': {
            value: 1,
            status: 1,
            des: 'May Chay'
        },
        '010': {
            value: 2,
            status: 0,
            des: 'May Ket Thuc'
        },
        '001': {
            value: 3,
            status: 0,
            des: 'May Loi'
        },
        '101': {
            value: 4,
            status: 1,
            des: 'May Chay'
        },
        '011': {
            value: 2,
            status: 0,
            des: 'May Ket Thuc'
        },
        '111': {
            value: 4,
            status: 0,
            des: 'May Khoi Dong'
        },
    }

    $('.status-machine-checkbox').on('change', function() {
        let val = runErrStop[`${$('#run-machine').prop('checked') ? 1 : 0}${$('#stop-machine').prop('checked') ? 1 : 0}${$('#error-machine').prop('checked') ? 1 : 0}`];
        console.log('Edit', `${$('#run-machine').prop('checked') ? 1 : 0}-${$('#stop-machine').prop('checked') ? 1 : 0}-${$('#error-machine').prop('checked') ? 1 : 0}`);
        console.log(val);
        if(val !== undefined) {
            socket.emit('machine-status', {
                username: $('.username').val(),
                password: $('.password').val(),
                MAC: $('.mac').val(),
                status: val.value,
                count: $('.quantity-count').val()
            });
        }
    });

    socket.on('machine-status', (msg) => {
        console.log(msg);
    });

    // Click Cause Error Stop
    socket.on('stop-error', (msg) => {
        console.log(msg);
        $('.alert-machine-status').text(msg.message);
    });
    $('.btn-err-stop-machine').on('click', function() {
        let id   = $(this).attr('id').split('-');
        let text = $(this).text();
        type     = id[id.length - 2];
        status   = id[id.length - 1];

        $('.alert-stop-error').text(`Nguyên Nhân Được Chọn ${text} - ${id.join('-')} - type: ${type} - status: ${status}`);
        let data = { 
            username: $('.username').val(),
            password: $('.password').val(),
            MAC     : $('.mac').val(),
            type    : type, // – int  : Loại nguyên nhân: 1: Nguyên nhân Lỗi, 2: Nguyên Nhân Dừng
            status  : status, // – int: Kiểu nguyên nhân lỗi hoặc dừng
            time    : $('.time-edit-err').val(), // – string: Thời gian sửa chữa lỗi

        }
        console.log("Click Cause Error Stop", data);
        socket.emit('stop-error', data);
        
    });

    socket.on('quality-product', (msg) => {
        console.log(msg);
    });

    // Click Cause Error Stop
    $('.btn-err-quality').on('click', function() {
        let id        = $(this).attr('id').split('-');
        let text      = $(this).text();
        typeQuatity   = id[id.length - 2];
        statusQuatity = id[id.length - 1];

        $('.alert-error-select').text(`Lỗi Được Chọn ${text} - ${id.join('-')} - type: ${typeQuatity} - status: ${statusQuatity}`);
        let data = {
            username: $('.username').val(),
            password: $('.password').val(),
            MAC     : $('.mac').val(),
            planId  : planId, // – int       : ID plan hiện tại đang chạy
            type    : typeQuatity, // – int  : Loại nguyên nhân NG, 0 : Gửi dữ liệu để lấy trạng thái ban đầu
            status  : statusQuatity, // – int: Loại nguyên nhân NG , 0: Gửi dữ liệu để lấy trạng thái ban đầu
            qtyNg   : $('.quantity-ng').val(), // – int: Số lượng NG
        }
        console.log("Click Cause Error Stop", data);
        socket.emit('quality-product', data);
    });

    socket.on('control-bell', (msg) => {
        console.log(msg);
        $('.modal-body-iot').children().remove();
        $('.modal-body-iot').append(`
            <span>Server send: ${JSON.stringify(msg)}</span>
        `)
        $('#modalUpdateIot').modal();
        setTimeout(() => {$('#modalUpdateIot').modal('hide');}, 15000);
    });

});