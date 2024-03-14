const { MAC } = require('./configs');
const { dataController } = require('./controller');
const { connect_socket, socket } = require('./Socket');
const { connect_plc, plc } = require('./PLC');
const { server, listen_tcp } = require('./TCPServer')
var assy_status = 0;
var flag_done = 0;
function check_assy_status(assy_status_) {
  if (assy_status_ !== assy_status) {
    const data = { mac: MAC, assy_status: assy_status_ };
    socket.emit('assy-status', data);
    assy_status = assy_status_;
  }
}
function check_done_frame(done_status, plc_data) {
  if (done_status == 1) {
    flag_done++;
    if (flag_done == 1) {
      const data = {
        mac: MAC,
        frame_id: plc_data.O_FrameID,
        Ass_Height: plc_data.Value_Frame[0],
        Drill_Depth: plc_data.Value_Frame[0],
        Pin_Error: plc_data.Value_Frame[0],
        Status: plc_data.Status_Frame,
      };
      socket.emit('assy-success-production', data);
    }
  }
  else {
    flag_done = 0;
  }
}
// PLC_BT
async function read_plc() {
  try {
    const plcData = await dataController(plc);
    check_assy_status(plcData.assy_status);
    check_done_frame(plcData.DoneFrame, plcData);
    console.log(plcData);
  } catch (error) {
    console.error('Error reading PLC data:', error);
  }
}
// function read_plc()
// {
//   plc.readAllItems(valuesReady);
// }
// function valuesReady(anythingBad, values) {
// 	if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
// 	console.log(values);
// 	doneReading = true;
// 	//if (doneWriting) { process.exit(); }
// }
async function main() {
  try {
    connect_plc();
    connect_socket();
    listen_tcp();

    setInterval(read_plc, 1000);
  } catch (error) {
    console.error('Error in main:', error);
  }
}
main();
