'use strict'
$(document).ready(() => {
    // console.log("Ok");
    let connect = false;
    let dataT;

    $('#dataTable_paginate').parent().removeClass('col-md-7').addClass('col-md-12');

    function formatDateTime(time = '') {
        let date    = time === '' ? new Date() : new Date(time);
        let year    = date.getFullYear();
        let month   = (date.getMonth() + 1).toString().length == 1 ? "0"+(date.getMonth() + 1) : date.getMonth() + 1;
        let day     = date.getDate().toString().length == 1 ? "0"+date.getDate() : date.getDate();
        let hour    = date.getHours().toString().length == 1 ? "0"+date.getHours() : date.getHours();
        let minute  = date.getMinutes().toString().length == 1 ? "0"+date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds().toString().length == 1 ? "0"+date.getSeconds() : date.getSeconds();
        let miliseconds = date.getMilliseconds();
        return `${year}-${month}-${day} ${hour}:${minute}:${seconds}.${miliseconds}`;
    }

    function editSizeWindown (destroy = false) {
        let widthCard = $(window).height() - 300;
        if(widthCard < 445) widthCard = 445;
        let configTable = {
            "lengthMenu": [4],
            "bLengthChange": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollY": widthCard - 67,
            "scrollCollapse": true,
            "paging": false
        };
        $('.chart-area').height(widthCard);
        $('#chat-content').height(widthCard);
        if (destroy) dataT.destroy();
        dataT = $('#dataTable').DataTable(configTable);
    }

    function drawTable (msg) {
        dataT.clear().draw();
        let disCon = []// Danh sach user disconnect;
        for(let i = 0; i < msg.length; i++) {
            let text  = 'Connect';
            let login = 'Login';
            let type  = 'Static';
            if(msg[i].connect == 0) {disCon.push(msg[i]); text = 'Disconnect';}
            if(msg[i].login == 0) {login = 'Logout';}
            if(msg[i].typeMachine != 1) {type = 'Dynamic';}
            dataT.row.add([i+1, msg[i].machineName, msg[i].mac, msg[i].ip, msg[i].versionFirmware, msg[i].hmi, text, login, type]).draw(false);
        }
    }

    function getListFirmwareIot() {
        return $.ajax({
            method: 'get',
            url: window.location.origin + '/api/get-list-forder',
            data: {},
            dataType: 'json'
        });
    }
    editSizeWindown();

    getListFirmwareIot().done((data) => {
        console.log(data);
        if(data.status) {
            $('#firmwareSelect').children().remove();
            for(let dat of data.listForder) {
                $('#firmwareSelect').append(`<option value="${dat}">${dat}</option>`)
            }
            $('#firmwareSelect').val(data.listForder.length != 0 ? data.listForder[0] : '');
        }
    }).catch((err) => {console.log(err)});

    socket.on('start-server-socket', (msg) => {
        console.log('start-server-socket');
        dataT.clear().draw();
        socket.emit('list-clients', {mac: $('#macIot').val()});
    });

    socket.on('update-progress', async (msg) => {
        if(!msg.done) {
            $('#update-progress').removeClass('hide');
            $('.update-progress').text(msg.count);
        } else {
            setTimeout(() => {
                $('#update-progress').addClass('hide');
            }, 10000);
        }
    })

    socket.on('update-firmware-client', (msg) => {
        console.log(msg);
        $('.modal-body-iot').children().remove();
        $('.modal-body-iot').append(`
            <span>Server url: ${msg.server.url}</span>
            <br>
            <span>Client Mac: ${msg.client.mac}</span>
            <br>
            <span>Client Firmware: ${msg.client.firmware}</span>
            <br>
            <span>Client url: ${msg.client.url}</span>
        `)
        $('#modalUpdateIot').modal();
        setTimeout(() => {$('#modalUpdateIot').modal('hide');}, 15000);
    });
    let draw = '';
    socket.on('list-clients', (msg) => {
        console.log('list-clients', msg);
        clearTimeout(draw);
        draw = setTimeout(function() {drawTable(msg);}, 300);
    });

    socket.on('upload-file', (msg) => {
        console.log(msg);
        $('#firmwareSelect').children().remove();
        for(let dat of msg.list) {
            $('#firmwareSelect').append(`<option value="${dat}">${dat}</option>`)
        }
        $('#firmwareSelect').val(msg.list.length != 0 ? msg.list[0] : '');
    });

    $('.btn-update-firmware').on('click', () => {
        let val = $('#updateFirmware').val().trim();
        let select = $('#firmwareSelect').val();

        if(val != '' && select != '') {
            socket.emit('update-firmware', {
                mac: val, 
                firmware: select,
                url: window.location.origin
            });
            socket.emit('list-clients', {mac: $('#macIot').val()});
        }
    });

    $('.btn-update-firmware-all').on('click', () => {
        let val = $('#updateFirmware').val().trim();
        let select = $('#firmwareSelect').val();

        if(select != '') {
            socket.emit('update-firmware', {
                mac: 'all', 
                firmware: select,
                url: window.location.origin
            });
            socket.emit('list-clients', {mac: $('#macIot').val()});
        }
    });

    $('#fileUploaded').on('change', function() {
        if($(this).val() != '') {
            $('#fileUploaded-label').text( $(this).val().split('\\').pop());
            $('input[name="fileUploaded"]').removeClass('is-invalid');
        } else {
            $('input[name="fileUploaded"]').addClass('is-invalid');
        }
    });

    $('.btn-upload-firmware').on('click', function(e) {
        if($('input[name="fileUploaded"]').val() === '') {
            $('input[name="fileUploaded"]').addClass('is-invalid');
            return false;
        } 
    });

    $('.btn-control-bell').on('click', function() {
        let data = {
            mac : $('#mac-iot-bell').val(),
            time: $('#time-control-bell').val()
        };

        socket.emit('control-bell', data);
        console.log("Control bell", data);
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

    window.onresize = function(event) {editSizeWindown(true);};
});