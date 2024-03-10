const io = require('socket.io-client');
const socket = io("http://127.0.0.1:3000");
const { plc_controller } = require('./controller');
const { plc } = require('./PLC')
const { convertString } = require('./Process_Data.js');
socket.on("connect", () => {
    console.log('Connected');
});
//
socket.on('assy-start-order', (data) => {
    console.log('assy-start-order:', data);
    const data_ = { Start_order: data.status }
    plc_controller(plc, data_);
});
socket.on('cmd-agv-status', (data) => {
    console.log('cmd-agv-status:', data);
    const data_ = { cmd_agv_status: data.cmd_agv_status }
    plc_controller(plc, data_);
});
socket.on('assy-send-frame_id', (data) => {
    const status = data.status;
    if (status == true) {
        const data_ = data.data;
        const order = { I_FrameID: convertString(data_.frame_id, data_.frame_id.length) };
        plc_controller(plc, order);
    }
    else {
        const data_ = { error_input_frame: !status };
        plc_controller(plc, data_);
    }

});
socket.on('assy-success-production', (data) => {
    const status = data.status;
    const data_ = { last_order: data.last_order };
    plc_controller(plc, data_);
    console.log('assy-success-production:', data);
});
socket.on('close', () => {
    console.log('Socket connection closed');
});

socket.on('error', (err) => {
    console.error('Socket error:', err);
});

function connect_socket() {
    socket.connect(() => {
    });
}

module.exports = {
    connect_socket,
    socket,
};
