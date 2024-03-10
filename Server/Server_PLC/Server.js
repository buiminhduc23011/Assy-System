const { MAC } = require('./configs');
const { dataController } = require('./controller');
const { connect_socket, socket } = require('./Socket');
const { connect_plc, plc } = require('./PLC');
const { reverseToString } = require('./Process_Data.js');

var assy_status = 0;
var I_FrameID = "";
function check_assy_status(assy_status_) {
  if (assy_status_ !== assy_status) {
    const data = { mac: MAC, assy_status: assy_status_ };
    socket.emit('assy-status', data);
    assy_status = assy_status_;
  }
}
function check_qrcode(I_FrameID_) {
  if (I_FrameID_ !== I_FrameID) {
    const data = { mac: MAC, frame_id: I_FrameID_ };
    socket.emit('assy-send-frame_id', data);
    I_FrameID = I_FrameID_;
  }
}
// PLC_BT
async function read_plc() {
  try {
    const plcData = await dataController(plc);
    check_assy_status(plcData.assy_status);
    
    check_qrcode(reverseToString(plcData.I_FrameID));
  } catch (error) {
    console.error('Error reading PLC data:', error);
  }
}
async function main() {
  try {
    connect_plc();
    connect_socket();

    setInterval(read_plc, 1000);
  } catch (error) {
    console.error('Error in main:', error);
  }
}

// Call the main function to start the application
main();
