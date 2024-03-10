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

    function updateUser(connect = 0, disconnect = 0, total = 0) {
        if(connect < 0) connect = 0;
        if(disconnect < 0) disconnect = 0;
        if(total < 0) total = 0;
        $('.total-user').text(total);
        $('.user-connect').text(connect);
        $('.user-disconnect').text(disconnect);
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
            dataT.row.add([i+1, msg[i].machineName, msg[i].mac, text, login]).draw(false);
        }
        updateUser(msg.length - disCon.length, disCon.length, msg.length);
    }

    function scrollBottomChat () {
        let heightChat  = 0;
        let maxWidth    = false;
        let widthParent = $('#chat-content').width();
        
        for(let media of $('#chat-content').children()) {
            heightChat += media.offsetHeight;
            // console.log('Scroll',media.offsetWidth - 0.1 , widthParent)
            media.offsetWidth > widthParent ? maxWidth = true : '';
        }
        // Animate
        $("#chat-content").animate({ scrollTop: heightChat }, 100);
        // console.log(heightChat > $('#chat-content').height(),heightChat , $('#chat-content').height());
        // Scroll
        if(heightChat > $('#chat-content').height()) {
            $('#chat-content.ps-container').css('overflow-y', 'scroll');
        } else {
            $('#chat-content.ps-container').css('overflow-y', 'hidden');
        }
        // if(maxWidth) {
            $('#chat-content.ps-container').css('overflow-x', 'scroll');
        // } else {
        //     $('#chat-content.ps-container').css('overflow-x', 'hidden');
        // }
    }

    function emitSttBtn (btn = 0, status = 0) {
        let msg = {
            mac: $('#macIot').val(),
            btn: btn,
            status: status
        }
        $('#chat-content').append(`<div class="media media-chat media-chat-reverse">
            <div class="media-body">
                <p>${JSON.stringify(msg)}</p>
                <p class="meta" style="color: red"><time datetime="${new Date().getUTCFullYear()}">${formatDateTime()}</time></p>
            </div>
            </div>`);
        if($('#macIot').val() == '') return;
        socket.emit('click-btn', msg);
        scrollBottomChat();
    }

    function getListFirmwareIot() {
        return $.ajax({
            method: 'get',
            url: window.location.origin + '/api/get-list-forder',
            data: {},
            dataType: 'json'
        });
    }

    scrollBottomChat();
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

    $('.btn-connect-server').on('click', () => {
        if($('#macIot').val() == '') return;
        socket.connect();
        socket.emit('connect-iot', {mac: $('#macIot').val()});
    });

    $('.btn-remove-server').on('click', () => {
        if($('#macIotRemove').val() == '') return;
        socket.emit('remove-client', {mac: $('#macIotRemove').val()});
    });

    socket.on('start-server-socket', (msg) => {
        console.log('start-server-socket');
        dataT.clear().draw();
        socket.emit('list-clients', {mac: $('#macIot').val()});
    });

    let draw = '';
    
    socket.on('list-clients', (msg) => {
        console.log('list-clients', msg);
        clearTimeout(draw);
        draw = setTimeout(function() {drawTable(msg);}, 300);
    });

    socket.on('led-control', (msg) => {
        console.log(msg);
    });

    socket.on('notification', (msg) => {
        // console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>Client : '+JSON.stringify(msg.client)+'</p> '+
                '<p>Server : '+JSON.stringify(msg.server)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    // Listen event send to OEE
    socket.on('machine-connect', (msg) => {
        console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>OEE : machine-connect</p> '+
                '<p>Server : '+JSON.stringify(msg)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    socket.on('machine-status', (msg) => {
        // console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>OEE : machine-status</p> '+
                '<p>Server : '+JSON.stringify(msg)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    socket.on('machine-output', (msg) => {
        // console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>OEE : machine-output</p> '+
                '<p>Server : '+JSON.stringify(msg)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    socket.on('machine-state', (msg) => {
        // console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>OEE : machine-state</p> '+
                '<p>Server : '+JSON.stringify(msg)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    socket.on('user-login', (msg) => {
        // console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>OEE : user-login</p> '+
                '<p>Server : '+JSON.stringify(msg)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    socket.on('machine-output-ng', (msg) => {
        // console.log(msg);
        $('#chat-content').append('<div class="media media-chat"> '+
            '<img class="avatar" src="../public/img/sti.png" alt="..."> '+
            '<div class="media-body"> '+
                '<p>OEE : machine-output-ng</p> '+
                '<p>Server : '+JSON.stringify(msg)+'</p> '+
                '<p class="meta"><time datetime="'+new Date().getUTCFullYear()+'">'+formatDateTime()+'</time></p> '+
                '</div> '+
            '</div>');
        scrollBottomChat();
    });

    // Click button control led
    $('.btn-on1').on('click', () => {emitSttBtn(1,1);});
    $('.btn-on2').on('click', () => {emitSttBtn(2,1);});
    $('.btn-off1').on('click', () => {emitSttBtn(1,2);});
    $('.btn-off2').on('click', () => {emitSttBtn(2,2);});

    // Remote Room
    $('.btn-join-to-room').on('click', () => {
        let mac = $('#macIotRemoveRoom').val();
        socket.emit('leave-notification', {mac: mac});
    });

    $('.btn-control-server').on('click', () => {
        let val = $('#macIotControl').val().trim().split(',');
        console.log(val);
        if(val.length == 3) {
            socket.emit('control-iot', {
                mac: val[0],
                btn1: val[1],
                btn2: val[2]
            });
        }
    });

    $('.btn-update-firmware').on('click', () => {
        let val = $('#updateFirmware').val().trim();

        if(val != '') {
            socket.emit('update-firmware', {mac: val, firmware: $('#firmwareSelect').val()});
        }
    });

    window.onresize = function(event) {editSizeWindown(true);};
});